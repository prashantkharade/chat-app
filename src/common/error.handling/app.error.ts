import { HttpStatusCodes } from './http.status.codes';

export class AppError extends Error {

    Code: number;

    Inner: Error;

    constructor(message: string, code: number = HttpStatusCodes.INTERNAL_SERVER_ERROR, inner: Error = null) {
        super(message);
        this.Code = code;
        this.Inner = inner;
    }

}
