import { forwardRef, Module } from '@nestjs/common';
import { VerifieService } from './verifie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifieEntity } from './verifie.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerifieEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [VerifieService],
  exports: [VerifieService],
})
export class VerifieModule {}
