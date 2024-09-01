import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenDecodeData } from '../interfaces/jwt-token-data.interface';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const requestHeaders = context.switchToHttp().getRequest().headers;
    const jwtService = new JwtService();

    const token = requestHeaders['authorization'].split(' ')[1];
    const userToken = jwtService.decode(token) as JwtTokenDecodeData;

    return userToken?.id ? userToken.id : null;
  },
);
