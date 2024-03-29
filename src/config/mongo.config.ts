import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './configuration.interface';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {

    constructor(private configService: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions {
        return this.configService.get<Configuration['mongo']>('mongo');
    }

}