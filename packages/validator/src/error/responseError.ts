export class ResponseError extends Error {
  status: number;
  errorCode: string | undefined;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}
