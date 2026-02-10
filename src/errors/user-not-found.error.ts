import { AppError } from "./app.error.js";

export class UserNotFoundError extends AppError {
  constructor(username: string) {
    super(`Usuário "${username}" não econtrado.`);
  }
}