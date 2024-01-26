import { Module } from '@nestjs/common';
import { VerifieService } from './verifie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifieEntity } from './verifie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerifieEntity])],
  providers: [VerifieService],
  exports: [VerifieService],
})
export class VerifieModule {}
