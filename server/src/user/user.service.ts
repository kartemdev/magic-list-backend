import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequestDTO,
  UpdateUserInfoRequestDTO,
} from './common/user.dto';
import { UserMapper } from './common/user.mappper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userMapper: UserMapper,
  ) {}

  async create(data: CreateUserRequestDTO) {
    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }

  async getUserInfo(id: number, isOutsideUse = false) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user && isOutsideUse) {
      return null;
    }

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    return this.userMapper.toResponseObject(user);
  }

  async getUserByEmailOrName(
    email: string,
    userName: string,
    isOutsideUse = false,
  ) {
    const user = await this.userRepository.findOne({
      where: [{ email }, { userName }],
    });

    if (!user && isOutsideUse) {
      return null;
    }

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUserInfo(id: number, data: UpdateUserInfoRequestDTO) {
    if (!data?.userName) {
      throw new HttpException('bad_request', HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.userRepository.findOne({
      where: [{ userName: data.userName }],
    });

    if (candidate?.userName === data.userName && candidate?.id !== id) {
      throw new HttpException(
        'user_name_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.save({ ...user, ...data });
  }
}
