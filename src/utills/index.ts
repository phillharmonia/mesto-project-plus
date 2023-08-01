export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  static BadRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static Unauthorized(message: string): AppError {
    return new AppError(message, 401);
  }

  static NotFound(message: string): AppError {
    return new AppError(message, 404);
  }

  static Forbidden(message: string): AppError {
    return new AppError(message, 403);
  }

  static ServerError(message: string): AppError {
    return new AppError(message, 500);
  }
}
