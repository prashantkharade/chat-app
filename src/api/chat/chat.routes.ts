import express from 'express';
import { ChatController } from './chat.controller';

export const register = (app: express.Application) => {
    const router = express.Router();
    const controller = new ChatController();

    router.post('/create', controller.createOrGet);
    router.post('/:chatId/message/send', controller.sendMessage);
    router.get('/:chatId/messages', controller.getMessages);
    router.post('/:chatId/message/:messageId/read', controller.markMessageRead);
    router.post('/:chatId/lastseen', controller.updateLastSeen);

    app.use('/chat', router);
};
