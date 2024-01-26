import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserMapper } from './common/user.mappper';
import { VerifieModule } from 'src/verifie/verifie.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    VerifieModule,
    MailingModule,
  ],
  providers: [UserService, UserMapper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
