import joi from 'joi';
import express from 'express';
import BaseValidator from '../base.validator';
import { UserCreateModel, UserSearchFilters } from '../../domain.types/user.types';

export class UserValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<UserCreateModel> => {
        const schema = joi.object({
            name : joi.string().trim().min(1).max(100).required(),
        }).required();

        const body = await this.validate<any>(schema, request.body);
        return { Name: body.name };
    };

    public validateSearchRequest = async (request: express.Request): Promise<UserSearchFilters> => {
        const schema = joi.object({
            name         : joi.string().trim().max(100).optional(),
            orderBy      : joi.string().valid('id', 'Name', 'CreatedAt').optional(),
            order        : joi.string().valid('ascending', 'descending').optional(),
            pageIndex    : joi.number().integer().min(0).optional(),
            itemsPerPage : joi.number().integer().min(1).max(100).optional(),
        });

        const query = await this.validate<any>(schema, request.query);
        return {
            name         : query.name,
            OrderBy      : query.orderBy,
            Order        : query.order,
            PageIndex    : query.pageIndex,
            ItemsPerPage : query.itemsPerPage,
        };
    };

}
