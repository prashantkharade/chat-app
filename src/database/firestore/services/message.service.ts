import {
    FieldPath,
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { FirestoreConnector } from '../firestore.connector';
import { AppError } from '../../../common/error.handling/app.error';
import { ErrorHandler } from '../../../common/error.handling/error.handler';
import { HttpStatusCodes } from '../../../common/error.handling/http.status.codes';
import { MessageMapper } from '../mappers/message.mapper';
import { LastSeenDocument, MessageDocument } from '../models/message.document';
import {
    LastSeenResponseDto,
    LastSeenUpdateModel,
    MessageCreateModel,
    MessageListResponseDto,
    MessageReadModel,
    MessageReadResponseDto,
    MessageResponseDto,
} from '../../../domain.types/message.types';

const FIRESTORE_TIMEOUT = 10000;

export class MessageService {

    public create = async (model: MessageCreateModel): Promise<MessageResponseDto> => {
        try {
            const message: MessageDocument = {
                senderId  : model.SenderId,
                text      : model.Text,
                createdAt : Timestamp.now(),
                readBy    : {},
            };
            const messageRef = doc(this.messages(model.ChatId));
            await this.withTimeout(setDoc(messageRef, message));
            return MessageMapper.toResponseDto(model.ChatId, messageRef.id, message);
        } catch (error) {
            this.rethrow(error, 'Unable to send message!');
        }
    };

    public getLatest = async (chatId: number, count: number): Promise<MessageListResponseDto> => {
        try {
            const q = query(this.messages(chatId), orderBy('createdAt', 'desc'), limit(count));
            const snapshot = await this.withTimeout(getDocs(q));
            const items = snapshot.docs
                .map((d) => MessageMapper.toResponseDto(chatId, d.id, d.data() as MessageDocument))
                .reverse();
            return { ChatId: chatId, Count: items.length, Items: items };
        } catch (error) {
            this.rethrow(error, 'Unable to get messages!');
        }
    };

    public markAsRead = async (model: MessageReadModel): Promise<MessageReadResponseDto> => {
        try {
            const messageRef = doc(this.messages(model.ChatId), model.MessageId);
            await this.ensureMessageExists(model.ChatId, model.MessageId);

            const readAt = Timestamp.now();
            await this.withTimeout(updateDoc(messageRef, new FieldPath('readBy', String(model.UserId)), readAt));

            return {
                ChatId    : model.ChatId,
                MessageId : model.MessageId,
                UserId    : model.UserId,
                ReadAt    : readAt.toDate().toISOString(),
            };
        } catch (error) {
            this.rethrow(error, 'Unable to mark message as read!');
        }
    };

    public updateLastSeen = async (model: LastSeenUpdateModel): Promise<LastSeenResponseDto> => {
        try {
            await this.ensureMessageExists(model.ChatId, model.MessageId);

            const lastSeen: LastSeenDocument = {
                messageId : model.MessageId,
                seenAt    : Timestamp.now(),
            };
            const lastSeenRef = doc(FirestoreConnector.db(), 'chats', String(model.ChatId), 'lastSeen', String(model.UserId));
            await this.withTimeout(setDoc(lastSeenRef, lastSeen));

            return {
                ChatId            : model.ChatId,
                UserId            : model.UserId,
                LastSeenMessageId : model.MessageId,
                SeenAt            : lastSeen.seenAt.toDate().toISOString(),
            };
        } catch (error) {
            this.rethrow(error, 'Unable to update last seen!');
        }
    };

    private messages = (chatId: number) => {
        return collection(FirestoreConnector.db(), 'chats', String(chatId), 'messages');
    };

    private ensureMessageExists = async (chatId: number, messageId: string) => {
        const snapshot = await this.withTimeout(getDoc(doc(this.messages(chatId), messageId)));
        if (!snapshot.exists()) {
            ErrorHandler.throwNotFoundError('Message not found!');
        }
    };

    private withTimeout = async <T>(promise: Promise<T>): Promise<T> => {
        let timer: NodeJS.Timeout;
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
                reject(new AppError('Firestore is not reachable!', HttpStatusCodes.SERVICE_UNAVAILABLE));
            }, FIRESTORE_TIMEOUT);
        });
        try {
            return await Promise.race([promise, timeout]);
        } finally {
            clearTimeout(timer);
        }
    };

    private rethrow(error: any, message: string): never {
        if (error instanceof AppError) {
            throw error;
        }
        ErrorHandler.throwDbAccessError(message, error);
    }

}
