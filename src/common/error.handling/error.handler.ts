import { HttpStatusCodes } from './http.status.codes';
import { AppError } from './app.error';
import { InputValidationError } from './input.validation.error';

export class ErrorHandler {

    static throwNotFoundError(message: string): never {
        throw new AppError(message, HttpStatusCodes.NOT_FOUND);
    }

    static throwForbiddenAccessError(message: string): never {
        throw new AppError(message, HttpStatusCodes.FORBIDDEN);
    }

    static throwDbAccessError(message: string, error: Error): never {
        throw new AppError(message, HttpStatusCodes.INTERNAL_SERVER_ERROR, error);
    }

    static handleValidationError(error: any): never {
        if (error?.isJoi) {
            throw new InputValidationError(error.details.map((x) => x.message));
        }
        throw new InputValidationError([error?.message ?? 'Invalid input!']);
    }

}
