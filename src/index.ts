#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { AppError } from "./errors/app.error.js";
import { UserNotFoundError } from "./errors/user-not-found.error.js";
import { activities } from "./options/activities.js";
import { repositories } from "./options/repositories.js";
import { fetchGithubUserData } from "./services/fetch-github-user-data.js";

let isRunning = true;
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
    const user = await fetchGithubUserData(username);
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
        await activities(username);
        break;

      case ("Repositórios"):
        await repositories(username);
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
