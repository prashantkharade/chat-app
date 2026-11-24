import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { ChatMember } from './chat.member.entity';

@Entity({ name: 'chats' })
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    PairKey: string;

    @OneToMany(() => ChatMember, (member) => member.Chat)
    Members: Relation<ChatMember[]>;

    @CreateDateColumn({ type: 'timestamptz' })
    CreatedAt: Date;

}
