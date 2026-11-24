import express from 'express';
import { ResponseHandler } from '../common/handlers/response.handler';
import { HttpStatusCodes } from '../common/error.handling/http.status.codes';

export const notFoundMiddleware = (request: express.Request, response: express.Response) => {
    ResponseHandler.failure(request, response, 'Route not found!', HttpStatusCodes.NOT_FOUND);
};

export const errorHandlerMiddleware = (
    error: any,
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction
) => {
    if (error?.type === 'entity.parse.failed') {
        return ResponseHandler.failure(request, response, 'Invalid JSON body!', HttpStatusCodes.BAD_REQUEST);
    }
    ResponseHandler.handleError(request, response, error);
};
