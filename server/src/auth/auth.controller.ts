import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PayloadLoginUserRequestDTO,
  PayloadRegisterUserRequestDTO,
  AuthUserResponseDTO,
} from './common/auth.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Логинизация пользователя' })
  @ApiResponse({ status: 201, type: AuthUserResponseDTO })
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() data: PayloadLoginUserRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshId } = await this.authService.login(
      data,
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, this.configService.get('auth-cookie'));

    return { accessToken };
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 200 })
  @Post('register')
  async register(
    @Req() req: Request,
    @Body() data: PayloadRegisterUserRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshId } = await this.authService.register(
      data,
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, this.configService.get('auth-cookie'));

    return { accessToken };
  }

  @ApiOperation({ summary: 'Выход пользователя из аккааунта' })
  @ApiResponse({ status: 200 })
  @Get('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.cookies['ml_uuid']);
  }

  @ApiOperation({ summary: 'Обновление JWT токенов' })
  @ApiResponse({ status: 200, type: AuthUserResponseDTO })
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshId } = await this.authService.refresh(
      req.cookies['ml_uuid'],
      req.headers['user-agent'],
    );

    res.cookie('ml_uuid', refreshId, this.configService.get('auth-cookie'));

    return { accessToken };
  }
}
