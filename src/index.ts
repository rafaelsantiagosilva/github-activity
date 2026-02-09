#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import "dotenv/config";
import inquirer from "inquirer";
import ora from "ora";

type Event = {
  repo: {
    name: string;
  };
  type: string;
  payload: {
    commits: unknown[],
    ref_type: string
  };
  action: string;
}

let response: Response;
const token = process.env.GITHUB_API_TOKEN;
const apiUrl = "https://api.github.com";
const spinner = ora("Carregando...");

program
  .version("1.0.0")
  .description("Github Activity");

program
  .action(async () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "Digite o username de um usuário: "
        },
        {
          type: "select",
          name: "choice",
          message: "O que você deseja buscar?",
          choices: ["Sobre", "Atividade", "Repositórios"]
        }
      ])
      .then(async ({ username, choice }) => {
        switch (choice) {
          case ("Sobre"):
            spinner.start();
            response = await fetch(`${apiUrl}/users/${username}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const user = await response.json();

            spinner.succeed();

            console.log(`👤 ${chalk.italic(user.name)}`);
            console.log(`🖼️ ${chalk.italic(user.bio)}`);
            console.log(`✉️ ${chalk.italic(user.mail)}`);
            break;

          case ("Atividade"):
            spinner.start();
            response = await fetch(`${apiUrl}/users/${username}/events`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const events = await response.json();

            spinner.succeed();

            events.map((event: Event) => {
              const repository = event.repo.name;

              switch (event.type) {
                case "PushEvent":
                  const commitCount = event.payload.commits ? event.payload.commits.length : 1;
                  console.log(chalk.cyan(`- Pushed ${commitCount} commit(s) no ${chalk.italic(repository)}`));
                  break;
                case "WatchEvent":
                  console.log(chalk.yellow(`- Olhou o ${chalk.italic(repository)}`));
                  break;
                case "CreateEvent":
                  console.log(chalk.green(`- Criou o ${chalk.italic(repository)}`));

                  break;
                case "IssuesEvent":
                  console.log(chalk.red(`- ${event.type} no ${chalk.italic(repository)}`));

                  break;

                default:
                  console.log(`- ${chalk.bold(event.type)} no ${chalk.italic(repository)}`);
                  break;
              }
            })
            break;

          case ("Repositórios"):
            spinner.start();
            response = await fetch(`${apiUrl}/users/${username}/repos`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const repositories = await response.json();

            spinner.succeed();

            repositories.map((repo: { name: string }) => {
              console.log(">" + repo.name);
            });
            break;
        }
      });
  });

program.parse(process.argv);