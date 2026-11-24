import 'reflect-metadata';
import http from 'http';
import express from 'express';
import { logger } from './logger/logger';
import { DatabaseConnector } from './database/database.connector';
import { FirestoreConnector } from './database/firestore/firestore.connector';
import { CommonMiddlewares } from './middlewares/common.middlewares';
import { RouteHandler } from './startup/route.handler';
import { errorHandlerMiddleware, notFoundMiddleware } from './middlewares/error.handler.middleware';

export default class Application {

    private _app: express.Application = express();

    private _server: http.Server = null;

    public start = async () => {
        try {
            await DatabaseConnector.connect();
            FirestoreConnector.connect();

            CommonMiddlewares.setup(this._app);
            RouteHandler.setup(this._app);
            this._app.use(notFoundMiddleware);
            this._app.use(errorHandlerMiddleware);

            const port = process.env.PORT || 3000;
            this._server = this._app.listen(port, () => {
                logger.info(`Chat service is running on port ${port}`);
            });
        } catch (error) {
            logger.error('Failed to start the service: ' + error.message);
            process.exit(1);
        }
    };

    public stop = async () => {
        this._server?.close();
        await FirestoreConnector.close();
        await DatabaseConnector.close();
    };

}
