import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import typeormPgConfig from './config/typeorm-pg.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormPgConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm-pg'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SessionModule,
  ],
})
export class AppModule {}
