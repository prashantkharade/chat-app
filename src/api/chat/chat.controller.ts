import express from 'express';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { HttpStatusCodes } from '../../common/error.handling/http.status.codes';
import { ChatValidator } from './chat.validator';
import { ChatService } from '../../database/typeorm/services/chat.service';
import { MessageService } from '../../database/firestore/services/message.service';

export class ChatController {

    _chatService: ChatService = new ChatService();

    _messageService: MessageService = new MessageService();

    _validator: ChatValidator = new ChatValidator();

    createOrGet = async (request: express.Request, response: express.Response) => {
        try {
            const model = await this._validator.validateCreateRequest(request);
            const result = await this._chatService.createOrGet(model);
            if (result.Created) {
                ResponseHandler.success(request, response, 'Chat created successfully!', HttpStatusCodes.CREATED, result);
            } else {
                ResponseHandler.success(request, response, 'Chat already exists!', HttpStatusCodes.OK, result);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendMessage = async (request: express.Request, response: express.Response) => {
        try {
            const model = await this._validator.validateSendMessageRequest(request);
            await this._chatService.ensureChatMember(model.ChatId, model.SenderId);
            const record = await this._messageService.create(model);
            ResponseHandler.success(request, response, 'Message sent successfully!', HttpStatusCodes.CREATED, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getMessages = async (request: express.Request, response: express.Response) => {
        try {
            const filters = await this._validator.validateGetMessagesRequest(request);
            await this._chatService.ensureChatExists(filters.ChatId);
            const result = await this._messageService.getLatest(filters.ChatId, filters.Limit);
            ResponseHandler.success(request, response, 'Messages retrieved successfully!', HttpStatusCodes.OK, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markMessageRead = async (request: express.Request, response: express.Response) => {
        try {
            const model = await this._validator.validateMarkReadRequest(request);
            await this._chatService.ensureChatMember(model.ChatId, model.UserId);
            const result = await this._messageService.markAsRead(model);
            ResponseHandler.success(request, response, 'Message marked as read!', HttpStatusCodes.OK, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateLastSeen = async (request: express.Request, response: express.Response) => {
        try {
            const model = await this._validator.validateLastSeenRequest(request);
            await this._chatService.ensureChatMember(model.ChatId, model.UserId);
            const result = await this._messageService.updateLastSeen(model);
            ResponseHandler.success(request, response, 'Last seen updated successfully!', HttpStatusCodes.OK, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
