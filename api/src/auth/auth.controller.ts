import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { PayloadRegisterUserDTO, ResponseAuthUserDTO } from './common/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Автоизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 200, type: ResponseAuthUserDTO })
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() data: PayloadRegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.register(
      data,
      req.headers['user-agent'],
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 48 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      accessToken,
    };
  }

  @ApiOperation({ summary: 'Обновление JWT токенов' })
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.refresh(
      req.cookies['refresh_token'],
      req.headers['user-agent'],
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 48 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      accessToken,
    };
  }
}
