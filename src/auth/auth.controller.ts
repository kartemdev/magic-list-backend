import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  PayloadLoginUserDTO,
  PayloadRegisterUserDTO,
  ResponseAuthUserDTO,
} from './common/auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Логинизация пользователя' })
  @ApiResponse({ status: 200, type: ResponseAuthUserDTO })
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() data: PayloadLoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshId } = await this.authService.login(
      data,
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      accessToken,
    };
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 200, type: ResponseAuthUserDTO })
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() data: PayloadRegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshId } = await this.authService.register(
      data,
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      accessToken,
    };
  }

  @ApiOperation({ summary: 'Выход пользователя из аккааунта' })
  @ApiResponse({ status: 200 })
  @Get('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.cookies['ml_uuid']);
  }

  @ApiOperation({ summary: 'Обновление JWT токенов' })
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshId } = await this.authService.refresh(
      req.cookies['ml_uuid'],
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      accessToken,
    };
  }
}
