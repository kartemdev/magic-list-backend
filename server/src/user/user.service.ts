import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequestDTO,
  UpdateUserInfoRequestDTO,
} from './common/user.dto';
import { UserMapper } from './common/user.mappper';
import { VerifieService } from 'src/verifie/verifie.service';
import { MailingService } from 'src/mailing/mailing.service';
import {
  MailTemplates,
  MailTemplatesContexts,
} from 'src/common/mail-templates';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userMapper: UserMapper,
    private verifeService: VerifieService,
    private mailingService: MailingService,
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

  async getVerifieCreatedTime(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    const {
      data: { createdAt },
      isExpires,
    } = await this.verifeService.getVerifie(user);

    return {
      verifieCreatedTime: createdAt.getTime(),
      isExpiresVerifie: isExpires,
    };
  }

  async sendVerifie(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('user_is_verified', HttpStatus.BAD_REQUEST);
    }

    const verifieCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    const verifie = await this.verifeService.create(user, verifieCode, 10);

    await this.mailingService.sendMail<
      MailTemplatesContexts[MailTemplates.VerifyUser]
    >({
      to: user.email,
      subject: 'Подтверждение учетной записи',
      template: MailTemplates.VerifyUser,
      context: {
        code: verifie.code,
        name: user.userName,
      },
    });
  }

  async confirmVerifie(userId: number, verifieCode: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('user_is_verified', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.verifeService.confirm(user.id, verifieCode);
    } catch (error) {
      throw new HttpException(`user_${error.message}`, HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.save({
      ...user,
      isVerified: true,
      verifieCreatedTime: null,
    });
  }
}
