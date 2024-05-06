import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  PayloadLoginUserRequestDTO,
  PayloadRegisterUserRequestDTO,
} from './common/auth.dto';
import { SessionService } from 'src/session/session.service';
import { v4 as uuid } from 'uuid';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  private generateTokens(data: { id: number }) {
    const accessToken = this.jwtService.sign(data, {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: '20m',
    });

    return {
      accessToken,
      refreshId: uuid(),
      expiresIn: new Date().getTime() + 360 * 60 * 60 * 1000,
    };
  }

  async login(data: PayloadLoginUserRequestDTO, userAgent: string) {
    const user = await this.userService.getUserByEmailOrName(
      data.email,
      null,
      true,
    );

    const passwordEquals = await bcryptjs.compare(
      data.password,
      user?.password || '',
    );

    if (!user || !passwordEquals) {
      throw new HttpException('invalid_password_email', HttpStatus.BAD_REQUEST);
    }

    if (user && passwordEquals) {
      const { accessToken, refreshId, expiresIn } = this.generateTokens({
        id: user.id,
      });

      const session = await this.sessionService.getByUser(user.id, true);

      if (session) {
        await this.sessionService.update({
          id: session.id,
          userAgent,
          refreshId,
          expiresIn,
        });
      } else {
        await this.sessionService.create({
          user,
          userAgent,
          refreshId,
          expiresIn,
        });
      }

      return { accessToken, refreshId };
    }
  }

  async register(data: PayloadRegisterUserRequestDTO, userAgent: string) {
    const candidate = await this.userService.getUserByEmailOrName(
      data.email,
      data.userName,
      true,
    );

    if (candidate?.userName === data.userName) {
      throw new HttpException(
        'user_name_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (candidate?.email === data.email) {
      throw new HttpException(
        'user_email_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await bcryptjs.hash(data.password, 5);
    const user = await this.userService.create({ ...data, password });

    const { accessToken, refreshId, expiresIn } = this.generateTokens({
      id: user.id,
    });

    await this.sessionService.create({
      user,
      userAgent,
      refreshId,
      expiresIn,
    });

    return { accessToken, refreshId };
  }

  async logout(referesId: string) {
    const session = await this.sessionService.getById(referesId, true);
    if (session) {
      await this.sessionService.delete(session.id);
    }
  }

  async refresh(clientRefreshId: string, userAgent: string) {
    const session = await this.sessionService.getById(clientRefreshId, true);

    if (!session) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const {
      userId,
      refreshId: currentRefreshId,
      expiresIn: currentExpiresIn,
      userAgent: currentUserAgent,
    } = session;

    if (
      currentRefreshId !== clientRefreshId ||
      currentUserAgent !== userAgent ||
      new Date().getTime() >= currentExpiresIn
    ) {
      await this.sessionService.delete(session.id);
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.getUserInfo(userId, true);

    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }

    const { accessToken, refreshId, expiresIn } = this.generateTokens({
      id: user.id,
    });

    await this.sessionService.update({
      id: session.id,
      userAgent,
      refreshId,
      expiresIn,
    });

    return { accessToken, refreshId };
  }
}
