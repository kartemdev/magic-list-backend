import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserMapper } from './common/user.mappper';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [UserService, UserMapper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
