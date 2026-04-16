export class AppError extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;

    // Corrige o prototype para que instanceof funcione
    Object.setPrototypeOf(this, AppError.prototype);
  }
}