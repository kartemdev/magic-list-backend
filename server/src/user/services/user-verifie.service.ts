import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { VerifieService } from 'src/verifie/verifie.service';
import { MailingService } from 'src/mailing/mailing.service';
import {
  MailTemplates,
  MailTemplatesContexts,
} from 'src/common/mail-templates';

@Injectable()
export class UserVerifieService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private verifeService: VerifieService,
    private mailingService: MailingService,
  ) {}
  async getVerifie(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    const {
      data: { createdAt },
      isExpires,
    } = await this.verifeService.getVerifie(user);

    return {
      createdAt,
      isExpiresVerifie: isExpires,
    };
  }

  async sendInitialVerifie(userId: number) {
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

  async confirmInitialVerifie(userId: number, verifieCode: string) {
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
