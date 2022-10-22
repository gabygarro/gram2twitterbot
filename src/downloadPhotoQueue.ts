import Queue from 'bull';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const downloadPhotoQueue = new Queue('downloadPhoto', { redis: { port: REDIS_PORT, host: REDIS_HOST, password: REDIS_PASSWORD } });

export default downloadPhotoQueue;
