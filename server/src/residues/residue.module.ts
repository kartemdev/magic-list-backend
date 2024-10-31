import { Module } from '@nestjs/common';

import { ResiduesService } from './residue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidueEntity } from './residue.entity';
import { ResiduesController } from './residues.controller';
import { VerifieModule } from 'src/verifie/verifie.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResidueEntity]),
    UserModule,
    AuthModule,
    VerifieModule,
    SessionModule,
  ],
  controllers: [ResiduesController],
  providers: [ResiduesService],
})
export class ResiduesModule {}
