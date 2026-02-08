#!/usr/bin/env node
import "dotenv/config";
const token = process.env.GITHUB_API_TOKEN;

fetch(
  "https://api.github.com/users/rafaelsantiagosilva",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
  .then(response => response.json())
  .then(response => {
    console.log(response);
  })
