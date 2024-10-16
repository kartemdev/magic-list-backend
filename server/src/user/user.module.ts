import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserMapper } from './common/user.mappper';
import { VerifieModule } from 'src/verifie/verifie.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserVerifieService } from './services/user-verifie.service';
import { UserVerifieController } from './controllers/user-verifie.controller';
import { UserController } from './controllers/user.controller';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    VerifieModule,
    MailingModule,
    SessionModule,
  ],
  providers: [UserService, UserVerifieService, UserMapper],
  exports: [UserService, UserVerifieService],
  controllers: [UserController, UserVerifieController],
})
export class UserModule {}
