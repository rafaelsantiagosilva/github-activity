#!/usr/bin/env node
import chalk from "chalk";
import "dotenv/config";
import inquirer from "inquirer";
import ora from "ora";
import { AppError } from "./errors/app.error.js";
import { UserNotFoundError } from "./errors/user-not-found.error.js";
import type { Event } from "./types/Event.js";
import { UnknownError } from "./errors/unknown.error.js";

let response: Response;
let isRunning = true;
const token = process.env.GITHUB_API_TOKEN;
const apiUrl = "https://api.github.com";
const spinner = ora("Carregando...");

try {
  do {
    const { username } = await inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "Digite o username de um usuário: "
        },
      ]);

    spinner.start();
    response = await fetch(`${apiUrl}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await response.json();

    spinner.succeed();

    if (user.status === "404")
      throw new UserNotFoundError("Usuário não econtrado.");

    const { choice } = await inquirer
      .prompt([
        {
          type: "select",
          name: "choice",
          message: "O que você deseja buscar?",
          choices: ["Sobre", "Atividade", "Repositórios"]
        }
      ]);

    switch (choice) {
      case ("Sobre"):
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

        if (events.status[0] !== "2") {
          throw new UnknownError();
        }

        if (!events.length) {
          console.log("> Nenhuma atividade encontrada");
          continue;
        }

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

        if (repositories.status[0] !== "2") {
          throw new UnknownError();
        }

        if (!repositories.length) {
          console.log("> Nenhum repositório encontrado");
          continue;
        }

        repositories.map((repo: { name: string }) => {
          console.log(">" + repo.name);
        });
        break;
    }

    const { confirm } = await inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Deseja terminar a aplicação?"
        }
      ]);

    isRunning = !confirm;
  } while (isRunning);
} catch (error: any) {
  if (error.message === "User force closed the prompt with SIGINT") {
    console.log("👋 Tchau!");
    process.exit(0);
  } else if (error instanceof AppError) {
    console.log(chalk.red(`! ${error.message}`));
  } else {
    console.log(chalk.red("Um erro ocorreu! Tente novamente."));
  }
}
