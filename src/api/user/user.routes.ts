import express from 'express';
import { UserController } from './user.controller';

export const register = (app: express.Application) => {
    const router = express.Router();
    const controller = new UserController();

    router.post('/', controller.create);
    router.get('/search', controller.search);
    router.get('/:userId', controller.getById);
    router.get('/:userId/chats', controller.getUserChats);

    app.use('/user', router);
};
