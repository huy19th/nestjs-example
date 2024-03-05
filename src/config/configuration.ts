import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { Configuration } from './configuration.interface';
require('dotenv').config();

const config: Configuration = {
    port: +process.env.PORT || 8080,
};

export const configuration: ConfigFactory<Configuration> = () => config;