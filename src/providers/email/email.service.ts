import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {

    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly mailerService: MailerService) { }

    send(to: string, subject: string, template: string, context?: object): void {
        this.mailerService.sendMail({ to, subject, template, context })
            .then(() => { })
            .catch((err) => this.logger.error(err));
    }
}