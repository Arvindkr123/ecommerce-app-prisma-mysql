import { HttpException } from "./root.exception";

// message: string;
// errorCode: any;
// statusCode: ErrorCode;
// errors: any;

export class UnprocessableEntity extends HttpException {
  constructor(error: any, message: string, errorCode: any) {
    super(message, errorCode, 422, error);
  }
}
