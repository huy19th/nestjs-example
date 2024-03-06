import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
    imports: [MulterModule.register({storage: memoryStorage()})],
    controllers: [UploadController]
})
export class UploadModule { }