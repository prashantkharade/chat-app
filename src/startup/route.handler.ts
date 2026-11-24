import express from 'express';
import { register as registerUserRoutes } from '../api/user/user.routes';
import { register as registerChatRoutes } from '../api/chat/chat.routes';

export class RouteHandler {

    static setup = (app: express.Application) => {
        app.get('/health-check', (_request, response) => {
            response.send('ok');
        });

        registerUserRoutes(app);
        registerChatRoutes(app);
    };

}
