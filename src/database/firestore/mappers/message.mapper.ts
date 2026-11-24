import { MessageDocument } from '../models/message.document';
import { MessageResponseDto } from '../../../domain.types/message.types';

export class MessageMapper {

    static toResponseDto = (chatId: number, messageId: string, message: MessageDocument): MessageResponseDto => {
        const readBy: Record<string, string> = {};
        for (const [userId, time] of Object.entries(message.readBy ?? {})) {
            readBy[userId] = time.toDate().toISOString();
        }
        return {
            id        : messageId,
            ChatId    : chatId,
            SenderId  : message.senderId,
            Text      : message.text,
            CreatedAt : message.createdAt.toDate().toISOString(),
            ReadBy    : readBy,
        };
    };

}
