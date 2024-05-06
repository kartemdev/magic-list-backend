import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequestDTO,
  UpdateUserInfoRequestDTO,
} from '../common/user.dto';
import { UserMapper } from '../common/user.mappper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userMapper: UserMapper,
  ) {}

  private async checkExistUpdateInfo<T>(
    id: number,
    key: keyof UserEntity,
    value: T,
  ) {
    const candidate = await this.userRepository.findOne({
      where: [{ [key]: value }],
    });

    return candidate?.[key] === value && candidate?.id !== id;
  }

  private async updateUserName(user: UserEntity, userName: string) {
    if (await this.checkExistUpdateInfo(user.id, 'userName', userName)) {
      throw new HttpException(
        'user_name_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.save({ ...user, userName });
  }

  private async updateEmail(user: UserEntity, email: string) {
    if (await this.checkExistUpdateInfo(user.id, 'email', email)) {
      throw new HttpException(
        'user_email_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.save({ ...user, email });
  }

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
    if (!data) {
      throw new HttpException('bad_request', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    const { userName, email } = data;

    if (userName) {
      await this.updateUserName(user, userName);
    }

    if (email) {
      await this.updateEmail(user, email);
    }
  }
}
