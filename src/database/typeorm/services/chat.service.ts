import { In, Repository } from 'typeorm';
import { Source } from '../../database.connector';
import { ErrorHandler } from '../../../common/error.handling/error.handler';
import { ChatCreateModel, ChatCreateResultDto, ChatResponseDto } from '../../../domain.types/chat.types';
import { BaseService } from './base.service';
import { ChatMapper } from '../mappers/chat.mapper';
import { Chat } from '../models/chat.entity';
import { ChatMember } from '../models/chat.member.entity';
import { User } from '../models/user.entity';

export class ChatService extends BaseService {

    _chatRepository: Repository<Chat> = Source.getRepository(Chat);

    _chatMemberRepository: Repository<ChatMember> = Source.getRepository(ChatMember);

    _userRepository: Repository<User> = Source.getRepository(User);

    public createOrGet = async (model: ChatCreateModel): Promise<ChatCreateResultDto> => {
        try {
            const userIds = [model.UserAId, model.UserBId];
            const usersFound = await this._userRepository.countBy({ id: In(userIds) });
            if (usersFound !== 2) {
                ErrorHandler.throwNotFoundError('One or both users not found!');
            }

            const pairKey = `${Math.min(...userIds)}_${Math.max(...userIds)}`;

            return await Source.transaction(async (manager) => {
                const inserted = await manager
                    .createQueryBuilder()
                    .insert()
                    .into(Chat)
                    .values({ PairKey: pairKey })
                    .orIgnore()
                    .returning(['id'])
                    .execute();

                const created = inserted.raw.length > 0;
                if (created) {
                    const chatId = inserted.raw[0].id;
                    await manager.insert(ChatMember, userIds.map((userId) => ({ ChatId: chatId, UserId: userId })));
                }

                const chat = await manager.findOne(Chat, {
                    where     : { PairKey: pairKey },
                    relations : { Members: true },
                });
                return { Chat: ChatMapper.toResponseDto(chat), Created: created };
            });
        } catch (error) {
            this.rethrow(error, 'Unable to create chat!');
        }
    };

    public getUserChats = async (userId: number): Promise<ChatResponseDto[]> => {
        try {
            const memberships = await this._chatMemberRepository.findBy({ UserId: userId });
            if (memberships.length === 0) {
                return [];
            }
            const chats = await this._chatRepository.find({
                where     : { id: In(memberships.map((m) => m.ChatId)) },
                relations : { Members: true },
                order     : { CreatedAt: 'DESC' },
            });
            return chats.map((chat) => ChatMapper.toResponseDto(chat));
        } catch (error) {
            this.rethrow(error, 'Unable to get user chats!');
        }
    };

    public ensureChatExists = async (chatId: number) => {
        try {
            const exists = await this._chatRepository.existsBy({ id: chatId });
            if (!exists) {
                ErrorHandler.throwNotFoundError('Chat not found!');
            }
        } catch (error) {
            this.rethrow(error, 'Unable to check chat!');
        }
    };

    public ensureChatMember = async (chatId: number, userId: number) => {
        await this.ensureChatExists(chatId);
        try {
            const isMember = await this._chatMemberRepository.existsBy({ ChatId: chatId, UserId: userId });
            if (!isMember) {
                ErrorHandler.throwForbiddenAccessError('User is not a member of this chat!');
            }
        } catch (error) {
            this.rethrow(error, 'Unable to check chat member!');
        }
    };

}
