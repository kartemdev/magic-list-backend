import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { SendMailRequestDTO } from './common/mailing.dto';

@Injectable()
export class MailingService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const mailerConfig = this.configService.get('mailer') as Record<
      string,
      string
    >;

    const oAuth2Client = new OAuth2(
      mailerConfig.clientId,
      mailerConfig.clientSecret,
      'https://developers.google.com/oauthplayground',
    );

    oAuth2Client.setCredentials({
      refresh_token: mailerConfig.refreshToken,
    });

    const { token } = await oAuth2Client.getAccessToken();

    this.mailerService.addTransporter('gmail', {
      service: 'gmail',
      auth: {
        accessToken: token,
        type: 'OAuth2',
        user: mailerConfig.gmail,
        clientId: mailerConfig.clientId,
        clientSecret: mailerConfig.clientSecret,
      },
    });
  }

  async sendMail<T>(data: SendMailRequestDTO<T>) {
    try {
      await this.setTransport();

      this.mailerService.sendMail({
        transporterName: 'gmail',
        from: null,
        ...data,
      });
    } catch {
      throw new HttpException('server_error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
