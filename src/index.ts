import 'dotenv/config';
import Application from './app';
import { logger } from './logger/logger';

const app = new Application();
app.start();

const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down...`);
    await app.stop();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
