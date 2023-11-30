import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  private parseCookies(cookieString: string) {
    if (!cookieString) {
      return null;
    }

    return cookieString.split(';').reduce((acc, cookie) => {
      const cookieName = cookie.split('=')[0].trim();
      const cookieValue = cookie.split('=')[1].trim();

      return { ...acc, [cookieName]: cookieValue };
    }, {} as Record<string, string>);
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const {
        authorization,
        cookie,
        ['user-agent']: headerUserAgent,
      } = request.headers;

      const typeToken = authorization.split(' ')[0];
      const token = authorization.split(' ')[1];

      if (typeToken !== 'Bearer' || !token) {
        throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const cookieRefreshId = this.parseCookies(cookie)?.['ml_uuid'];

      const { id, refreshId, expiresIn, userAgent } =
        await this.sessionService.getById(cookieRefreshId);

      if (
        !this.jwtService.verify(token, {
          secret: process.env.ACCESS_SECRET_KEY,
        }) ||
        cookieRefreshId !== refreshId ||
        headerUserAgent !== userAgent ||
        new Date().getTime() >= expiresIn
      ) {
        await this.sessionService.delete(id);
        throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
      }

      return true;
    } catch {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
