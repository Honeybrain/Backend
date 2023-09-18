import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/_utils/config/config';
import { MailsService } from './mails.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          auth: { user: configService.get('SMTP_USER'), pass: configService.get('SMTP_PASSWORD') },
        },
        template: { dir: __dirname + '/templates', adapter: new EjsAdapter() },
        defaults: { from: configService.get('SMTP_FROM') },
        preview: configService.get('SMTP_PREVIEW'),
      }),
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
