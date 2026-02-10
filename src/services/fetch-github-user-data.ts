import "dotenv/config";
import ora from "ora";
import { UnknownError } from "../errors/unknown.error.js";
import { UserNotFoundError } from "../errors/user-not-found.error.js";

type ApiEndpoint = "" | "/events" | "/repos";

export async function fetchGithubUserData(username: string, endpoint: ApiEndpoint = "") {
  const token = process.env.GITHUB_API_TOKEN;

  const spinner = ora("Carregando...");
  spinner.start();

  let response: Response;

  if (token) {
    response = await fetch(`https://api.github.com/users/${username.concat(endpoint)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    response = await fetch(`https://api.github.com/users/${username.concat(endpoint)}`);
  }

  spinner.succeed();

  if (!response.ok) {
    if (endpoint !== "") {
      throw new UnknownError();
    }

    throw new UserNotFoundError(username);
  }

  return await response.json();
}