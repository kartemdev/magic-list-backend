import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VerifieEntity } from './verifie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class VerifieService {
  constructor(
    @InjectRepository(VerifieEntity)
    private verifieRepository: Repository<VerifieEntity>,
  ) {}

  async getVerifie(user: UserEntity) {
    const verifie = await this.verifieRepository.findOne({
      where: { userId: user.id },
    });

    if (!verifie) {
      throw new HttpException('verifie_not_found_data', HttpStatus.NOT_FOUND);
    }

    const isExpires = new Date().getTime() >= +verifie.expiresIn;

    return {
      data: verifie,
      isExpires,
    };
  }

  async create(user: UserEntity, verifeCode: string, expiresInMinutes: number) {
    const presumedVerifie = await this.verifieRepository.findOne({
      where: { userId: user.id },
    });

    if (presumedVerifie) {
      await this.verifieRepository.delete(presumedVerifie?.id);
    }

    const verifie = this.verifieRepository.create({
      user: user,
      code: verifeCode,
      expiresIn: new Date().getTime() + 60 * expiresInMinutes * 1000,
    });

    await this.verifieRepository.save(verifie);

    return verifie;
  }

  async delete(userId: number) {
    const verifie = await this.verifieRepository.findOne({
      where: { userId },
    });

    if (!verifie) {
      throw new HttpException('server_error', HttpStatus.BAD_REQUEST);
    }

    await this.verifieRepository.delete(verifie.id);
  }

  async confirm(userId: number, code: string) {
    const verifie = await this.verifieRepository.findOne({
      where: { userId },
    });

    const isExpiresVerifie = new Date().getTime() >= +verifie?.expiresIn;

    if (!verifie || isExpiresVerifie) {
      throw new HttpException('verifie_expires_data', HttpStatus.BAD_REQUEST);
    }

    if (verifie.code !== code) {
      throw new HttpException('verifie_invalid_data', HttpStatus.BAD_REQUEST);
    }

    await this.verifieRepository.delete(verifie.id);
  }
}
