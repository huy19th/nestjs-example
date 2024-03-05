import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { Configuration } from './configuration.interface';
require('dotenv').config();

const config: Configuration = {
    port: +process.env.PORT || 8080,
    mongo: {
        uri: process.env.MONGO_URI
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        username: process.env.REDIS_USERNAME || 'root',
        password: process.env.REDIS_PASSWORD || 'password',
    },
};

export const configuration: ConfigFactory<Configuration> = () => config;