import { fetchGithubUserData } from "../services/fetch-github-user-data.js";

export async function repositories(username: string) {
  const repositories = await fetchGithubUserData(username, "/repos");
  
  if (!repositories.length) {
    console.log("> Nenhum repositório encontrado");
    return;
  }

  repositories.map((repo: { name: string }) => {
    console.log(">" + repo.name);
  });
}