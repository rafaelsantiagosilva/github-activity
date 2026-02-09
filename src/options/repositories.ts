import ora from "ora";
import { UnknownError } from "../errors/unknown.error.js";
import { fetchGithubUserData } from "../services/fetch-github-user-data.js";

export async function repositories(username: string) {
  const spinner = ora("Carregando repositórios do usuário...");
  spinner.start();

  const repositories = await fetchGithubUserData(username, "/repos");

  spinner.succeed();

  if (repositories.status[0] !== "2") {
    throw new UnknownError();
  }

  if (!repositories.length) {
    console.log("> Nenhum repositório encontrado");
    return;
  }

  repositories.map((repo: { name: string }) => {
    console.log(">" + repo.name);
  });
}