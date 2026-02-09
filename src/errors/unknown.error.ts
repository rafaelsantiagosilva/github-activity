import { AppError } from "./app.error.js";

export class UnknownError extends AppError {
  constructor() {
    super("Um erro desconhecido ocorreu. Tente novamente.");
  }
}