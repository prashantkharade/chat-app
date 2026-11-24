import express from 'express';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { HttpStatusCodes } from '../../common/error.handling/http.status.codes';
import { ErrorHandler } from '../../common/error.handling/error.handler';
import { UserValidator } from './user.validator';
import { UserService } from '../../database/typeorm/services/user.service';
import { ChatService } from '../../database/typeorm/services/chat.service';

export class UserController {

    _service: UserService = new UserService();

    _chatService: ChatService = new ChatService();

    _validator: UserValidator = new UserValidator();

    create = async (request: express.Request, response: express.Response) => {
        try {
            const model = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            ResponseHandler.success(request, response, 'User added successfully!', HttpStatusCodes.CREATED, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            const userId = await this._validator.requestParamAsInteger(request, 'userId');
            const record = await this._service.getById(userId);
            ResponseHandler.success(request, response, 'User retrieved successfully!', HttpStatusCodes.OK, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            const filters = await this._validator.validateSearchRequest(request);
            const results = await this._service.search(filters);
            ResponseHandler.success(request, response, 'Users retrieved successfully!', HttpStatusCodes.OK, results);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserChats = async (request: express.Request, response: express.Response) => {
        try {
            const userId = await this._validator.requestParamAsInteger(request, 'userId');
            const exists = await this._service.exists(userId);
            if (!exists) {
                ErrorHandler.throwNotFoundError('User not found!');
            }
            const chats = await this._chatService.getUserChats(userId);
            ResponseHandler.success(request, response, 'User chats retrieved successfully!', HttpStatusCodes.OK, {
                UserId : userId,
                Chats  : chats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
