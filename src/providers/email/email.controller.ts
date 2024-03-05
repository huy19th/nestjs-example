import { Controller, Body, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {

    constructor(private emailService: EmailService) { }

    @Post('/')
    sendEmail(@Body('message') message: string, @Body('to') to: string) {
        this.emailService.send(
            to,
            'test nodemailer',
            'test',
            { message }
        );
        return 'ok';
    }
}