import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerConfigService } from 'src/config/nodemailer.config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
    imports: [MailerModule.forRootAsync({ useClass: NodemailerConfigService, imports: [ConfigModule] })],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }