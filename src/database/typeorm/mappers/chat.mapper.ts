import { Chat } from '../models/chat.entity';
import { ChatResponseDto } from '../../../domain.types/chat.types';

export class ChatMapper {

    static toResponseDto = (chat: Chat): ChatResponseDto => {
        if (!chat) {
            return null;
        }
        return {
            id        : chat.id,
            MemberIds : (chat.Members ?? []).map((m) => m.UserId).sort((a, b) => a - b),
            CreatedAt : chat.CreatedAt,
        };
    };

}
