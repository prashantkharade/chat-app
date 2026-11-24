import express from 'express';
import { ResponseDto } from '../../domain.types/miscellaneous/response.dto';
import { InputValidationError } from '../error.handling/input.validation.error';
import { AppError } from '../error.handling/app.error';
import { HttpStatusCodes } from '../error.handling/http.status.codes';
import { logger } from '../../logger/logger';

export class ResponseHandler {

    static success(
        request: express.Request,
        response: express.Response,
        message: string,
        httpCode: number,
        data?: any
    ) {
        const responseObject: ResponseDto = {
            Status   : 'success',
            Message  : message,
            HttpCode : httpCode,
            Data     : data ?? null,
        };
        return response.status(httpCode).send(responseObject);
    }

    static failure(
        request: express.Request,
        response: express.Response,
        message: string,
        httpCode: number,
        errors?: string[]
    ) {
        logger.warn(`${request.method} ${request.originalUrl} - ${httpCode} ${message}`);
        const responseObject: ResponseDto = {
            Status   : 'failure',
            Message  : message,
            HttpCode : httpCode,
            Errors   : errors,
        };
        return response.status(httpCode).send(responseObject);
    }

    static handleError(request: express.Request, response: express.Response, error: any) {
        if (error instanceof InputValidationError) {
            return ResponseHandler.failure(request, response, error.message, error.Code, error.Errors);
        }
        if (error instanceof AppError) {
            if (error.Inner) {
                logger.error(error.Inner.stack ?? error.Inner.message);
            }
            return ResponseHandler.failure(request, response, error.message, error.Code);
        }
        logger.error(error?.stack ?? String(error));
        return ResponseHandler.failure(
            request, response, 'Internal server error!', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

}
