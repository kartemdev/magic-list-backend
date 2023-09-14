import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadLoginUserDTO, PayloadRegisterUserDTO } from './common/auth.dto';
import { JwtUser } from './common/auth.interface';
import { SessionService } from 'src/session/session.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  private generateTokens(data: JwtUser) {
    const secretKeys = this.configService.get('jwt-secrets');

    const accessToken = this.jwtService.sign(data, {
      secret: secretKeys.accessSecret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(data, {
      secret: secretKeys.refreshSecret,
      expiresIn: '48h',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(data: PayloadLoginUserDTO, userAgent: string) {
    try {
      const user = await this.userService.getUserByEmail(data.email);
      const passwordEquals = await bcryptjs.compare(
        data.password,
        user?.password,
      );

      if (user && passwordEquals) {
        const { id, userName, email } = user;

        const { accessToken, refreshToken } = this.generateTokens({
          id,
          userName,
          email,
        });

        const session = await this.sessionService.getByUser(user.id);
        if (session) {
          await this.sessionService.update({
            id: session.id,
            userAgent,
            refreshToken,
          });
        } else {
          await this.sessionService.create({
            user,
            userAgent,
            refreshToken,
          });
        }

        return {
          user: {
            userName,
            email,
          },
          accessToken,
          refreshToken,
        };
      }
    } catch {
      throw new UnauthorizedException({
        message: 'invalid_password_email',
      });
    }
  }

  async register(data: PayloadRegisterUserDTO, userAgent: string) {
    const candidate = await this.userService.getUserByEmail(data.email);

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

    const { accessToken, refreshToken } = this.generateTokens({
      id,
      userName,
      email,
    });

    await this.sessionService.create({
      user,
      userAgent,
      refreshToken,
    });

    return {
      user: {
        userName,
        email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string, userAgent: string) {
    const secretKeys = await this.configService.get('jwt-secrets');

    const session = await this.sessionService.getByToken(token);
    if (!session) {
      throw new UnauthorizedException('unauthorized');
    }

    const decodeUser = await this.jwtService.verify(session.refreshToken, {
      secret: secretKeys.refreshSecret,
    });
    if (!decodeUser || session?.userAgent !== userAgent) {
      await this.sessionService.delete(session.id);
      throw new UnauthorizedException('unauthorized');
    }

    const user = await this.userService.getUserByEmail(decodeUser.email);
    const { id, userName, email } = user;

    const { accessToken, refreshToken } = this.generateTokens({
      id,
      userName,
      email,
    });

    await this.sessionService.update({
      id: session.id,
      userAgent,
      refreshToken,
    });

    return {
      user: {
        userName,
        email,
      },
      accessToken,
      refreshToken,
    };
  }
}
