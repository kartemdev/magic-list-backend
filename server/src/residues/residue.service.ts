import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResidueEntity } from './residue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResiduesService {
  constructor(
    @InjectRepository(ResidueEntity)
    private residuesRepository: Repository<ResidueEntity>,
  ) {}

  async getResiduesByUserId(userId: number) {
    return await this.residuesRepository.find({
      where: { userId },
      select: ['id', 'article', 'product', 'residue', 'unitPrice', 'createdAt'],
    });
  }
}
