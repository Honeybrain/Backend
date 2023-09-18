import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  sendActivationMail = (email: string, activationLink: string) =>
    this.mailerService.sendMail({
      to: email,
      subject: 'Honeybrain Account Activation',
      template: 'activation-mail.template.ejs',
      context: { activationLink },
    });
}
