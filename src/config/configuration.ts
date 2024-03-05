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
    nodemailer: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
        host: process.env.NODEMAILER_HOST,
        port: +process.env.NODEMAILER_PORT
    },
};

export const configuration: ConfigFactory<Configuration> = () => config;