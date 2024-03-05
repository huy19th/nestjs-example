import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Injectable()
export class NodemailerConfigService implements MailerOptionsFactory {

    constructor(private configService: ConfigService) { }

    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        return {
            transport: {
                host: this.configService.get<string>('nodemailer.host'),
                port: this.configService.get<number>('nodemailer.port'),
                auth: {
                    user: this.configService.get<string>('nodemailer.user'),
                    pass: this.configService.get<string>('nodemailer.pass'),
                },
            },
            defaults: {
                from: this.configService.get<string>('nodemailer.user'),
            },
            template: {
                dir: join(__dirname, '../../src/providers/email/templates'),
                adapter: new EjsAdapter({ inlineCssEnabled: true }),
                options: {
                    strict: false,
                },
            }
        }
    }
}