import { DataSource } from 'typeorm';
import { logger } from '../logger/logger';
import { User } from './typeorm/models/user.entity';
import { Chat } from './typeorm/models/chat.entity';
import { ChatMember } from './typeorm/models/chat.member.entity';

export const Source = new DataSource({
    type        : 'postgres',
    host        : process.env.DB_HOST,
    port        : Number(process.env.DB_PORT),
    username    : process.env.DB_USER_NAME,
    password    : process.env.DB_USER_PASSWORD,
    database    : process.env.DB_NAME,
    entities    : [User, Chat, ChatMember],
    synchronize : true,
});

export class DatabaseConnector {

    static connect = async () => {
        await Source.initialize();
        logger.info('Connected to PostgreSQL');
    };

    static close = async () => {
        if (Source.isInitialized) {
            await Source.destroy();
        }
    };

}
