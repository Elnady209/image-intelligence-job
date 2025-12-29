import { Queue } from 'bullmq';

export const imageQueue = new Queue('image-processing', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  },
});
