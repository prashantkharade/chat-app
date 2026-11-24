import { HttpStatusCodes } from './http.status.codes';
import { AppError } from './app.error';

export class InputValidationError extends AppError {

    Errors: string[];

    constructor(errors: string[]) {
        super('Input validation failed!', HttpStatusCodes.BAD_REQUEST);
        this.Errors = errors;
    }

}
