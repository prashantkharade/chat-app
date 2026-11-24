import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

export class CommonMiddlewares {

    static setup = (app: express.Application) => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(helmet());
        app.use(cors());
    };

}
