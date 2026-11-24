import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from './user.entity';

@Entity({ name: 'chat_members' })
@Index(['UserId'])
export class ChatMember {

    @PrimaryColumn()
    ChatId: number;

    @PrimaryColumn()
    UserId: number;

    @ManyToOne(() => Chat, (chat) => chat.Members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ChatId' })
    Chat: Relation<Chat>;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'UserId' })
    User: Relation<User>;

}
