import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadLoginUserDTO, PayloadRegisterUserDTO } from './common/auth.dto';
import { JwtUser } from './common/auth.interface';
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

  private generateTokens(data: JwtUser) {
    const accessToken = this.jwtService.sign(data, {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: '30m',
    });

    return {
      accessToken,
      refreshId: uuid(),
      expiresIn: new Date().getTime() + 360 * 60 * 60 * 1000,
    };
  }

  async login(data: PayloadLoginUserDTO, userAgent: string) {
    const user = await this.userService.getByEmail(data.email);
    const passwordEquals = await bcryptjs.compare(
      data.password,
      user?.password || '',
    );

    if (!user || !passwordEquals) {
      throw new HttpException(
        'invalid_password_email',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user && passwordEquals) {
      const { id, userName, email } = user;

      const { accessToken, refreshId, expiresIn } = this.generateTokens({
        id,
        userName,
        email,
      });

      const session = await this.sessionService.getByUser(user.id);
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

      return {
        user: {
          userName,
          email,
        },
        accessToken,
        refreshId,
      };
    }
  }

  async register(data: PayloadRegisterUserDTO, userAgent: string) {
    const candidate = await this.userService.getByEmail(data.email);

    if (candidate?.userName === data.userName) {
      throw new HttpException(
        'user_email_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (candidate?.userName === data.userName) {
      throw new HttpException(
        'user_name_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await bcryptjs.hash(data.password, 5);
    const user = await this.userService.create({ ...data, password });

    const { id, userName, email } = user;

    const { accessToken, refreshId, expiresIn } = this.generateTokens({
      id,
      userName,
      email,
    });

    await this.sessionService.create({
      user,
      userAgent,
      refreshId,
      expiresIn,
    });

    return {
      user: {
        userName,
        email,
      },
      accessToken,
      refreshId,
    };
  }

  async logout(referesId: string) {
    const session = await this.sessionService.get(referesId);
    if (session) {
      await this.sessionService.delete(session.id);
    }
  }

  async refresh(clientRefreshId: string, userAgent: string) {
    const session = await this.sessionService.get(clientRefreshId);
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

    const user = await this.userService.get(userId);

    const { id, userName, email } = user;

    const { accessToken, refreshId, expiresIn } = this.generateTokens({
      id,
      userName,
      email,
    });

    await this.sessionService.update({
      id: session.id,
      userAgent,
      refreshId,
      expiresIn,
    });

    return {
      user: {
        userName,
        email,
      },
      accessToken,
      refreshId,
    };
  }
}
