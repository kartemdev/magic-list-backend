import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenDecodeData } from 'src/common/interfaces/jwt-token-data.interface';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class VerifieGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userSerivce: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    const token = authorization.split(' ')[1];
    const decodeToken = this.jwtService.decode(token) as JwtTokenDecodeData;

    const user = await this.userSerivce.getUserInfo(decodeToken.id);

    if (!user.isVerified) {
      throw new HttpException('user_not_verifie', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
