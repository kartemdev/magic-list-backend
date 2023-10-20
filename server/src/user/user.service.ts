import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './common/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserDTO) {
    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }

  async get(id: number) {
    if (!id) {
      return null;
    }

    const user = this.userRepository.findOne({ where: { id } });

    return user;
  }

  async getByEmailOrName(email: string, userName?: string) {
    if (!email) {
      return null;
    }

    const user = this.userRepository.findOne({
      where: [{ email }, { userName }],
    });

    return user;
  }
}
