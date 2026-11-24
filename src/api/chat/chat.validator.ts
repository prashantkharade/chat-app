import joi from 'joi';
import express from 'express';
import BaseValidator from '../base.validator';
import { ChatCreateModel } from '../../domain.types/chat.types';
import {
    LastSeenUpdateModel,
    MessageCreateModel,
    MessageReadModel,
    MessageSearchFilters,
} from '../../domain.types/message.types';

const id = () => joi.number().integer().positive();

export class ChatValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<ChatCreateModel> => {
        const schema = joi.object({
            userAId : id().required(),
            userBId : id().required().invalid(joi.ref('userAId')).messages({
                'any.invalid' : '"userBId" must be different from "userAId"',
            }),
        }).required();

        const body = await this.validate<any>(schema, request.body);
        return {
            UserAId : body.userAId,
            UserBId : body.userBId,
        };
    };

    public validateSendMessageRequest = async (request: express.Request): Promise<MessageCreateModel> => {
        const chatId = await this.requestParamAsInteger(request, 'chatId');
        const schema = joi.object({
            senderId : id().required(),
            text     : joi.string().trim().min(1).max(4000).required(),
        }).required();

        const body = await this.validate<any>(schema, request.body);
        return {
            ChatId   : chatId,
            SenderId : body.senderId,
            Text     : body.text,
        };
    };

    public validateGetMessagesRequest = async (request: express.Request): Promise<MessageSearchFilters> => {
        const chatId = await this.requestParamAsInteger(request, 'chatId');
        const schema = joi.object({
            limit : joi.number().integer().min(1).max(100).default(50),
        });

        const query = await this.validate<any>(schema, request.query);
        return {
            ChatId : chatId,
            Limit  : query.limit,
        };
    };

    public validateMarkReadRequest = async (request: express.Request): Promise<MessageReadModel> => {
        const chatId = await this.requestParamAsInteger(request, 'chatId');
        const messageId = await this.requestParamAsString(request, 'messageId');
        const schema = joi.object({
            userId : id().required(),
        }).required();

        const body = await this.validate<any>(schema, request.body);
        return {
            ChatId    : chatId,
            MessageId : messageId,
            UserId    : body.userId,
        };
    };

    public validateLastSeenRequest = async (request: express.Request): Promise<LastSeenUpdateModel> => {
        const chatId = await this.requestParamAsInteger(request, 'chatId');
        const schema = joi.object({
            userId    : id().required(),
            messageId : joi.string().trim().min(1).max(256).required(),
        }).required();

        const body = await this.validate<any>(schema, request.body);
        return {
            ChatId    : chatId,
            UserId    : body.userId,
            MessageId : body.messageId,
        };
    };

}
