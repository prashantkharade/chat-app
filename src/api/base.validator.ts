import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../common/error.handling/error.handler';

export default class BaseValidator {

    public requestParamAsInteger = async (request: express.Request, paramName: string): Promise<number> => {
        const schema = joi.number().integer().positive().required().label(paramName);
        return await this.validate<number>(schema, request.params[paramName]);
    };

    public requestParamAsString = async (request: express.Request, paramName: string): Promise<string> => {
        const schema = joi.string().trim().min(1).max(256).required().label(paramName);
        return await this.validate<string>(schema, request.params[paramName]);
    };

    protected validate = async <T>(schema: joi.Schema, value: unknown): Promise<T> => {
        try {
            return await schema.validateAsync(value, { abortEarly: false });
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

}
