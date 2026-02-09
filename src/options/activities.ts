import chalk from "chalk";
import ora from "ora";
import { UnknownError } from "../errors/unknown.error.js";
import { fetchGithubUserData } from "../services/fetch-github-user-data.js";
import type { Event } from "../types/Event.js";

export async function activities(user: string) {
  const spinner = ora("Carregando atividade do usuário...");

  spinner.start();
  const events = await fetchGithubUserData("/events");

  spinner.succeed();

  if (events.status[0] !== "2") {
    throw new UnknownError();
  }

  if (!events.length) {
    console.log("> Nenhuma atividade encontrada");
    return;
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
}