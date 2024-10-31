import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { MailingModule } from './mailing/mailing.module';
import typeormPgConfig from './config/typeorm-pg.config';
import authCookieConfig from './config/auth-cookie.config';
import mailerConfig from './config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { VerifieModule } from './verifie/verifie.module';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResiduesModule } from './residues/residue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormPgConfig, authCookieConfig, mailerConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm-pg'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: path.join(__dirname, 'common/mail-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
    UserModule,
    AuthModule,
    SessionModule,
    MailingModule,
    VerifieModule,
    ResiduesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
