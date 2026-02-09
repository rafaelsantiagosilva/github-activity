import "dotenv/config";

type ApiEndpoint = "/" | "/events" | "/repos";

export async function fetchGithubUserData(username: string, endpoint: ApiEndpoint = "/") {
  const token = process.env.GITHUB_API_TOKEN;
  const response = await fetch(`https://api.github.com/users/${username.concat(endpoint)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await response.json();
}