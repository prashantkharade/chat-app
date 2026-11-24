const time = () => new Date().toISOString();

export const logger = {
    info  : (message: string) => console.log(`[${time()}] INFO  ${message}`),
    warn  : (message: string) => console.warn(`[${time()}] WARN  ${message}`),
    error : (message: string) => console.error(`[${time()}] ERROR ${message}`),
};
