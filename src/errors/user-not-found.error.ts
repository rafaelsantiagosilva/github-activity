import { AppError } from "./app.error.js";

export class UserNotFoundError extends AppError {
  constructor(message: string) {
    super(message);
  }
}