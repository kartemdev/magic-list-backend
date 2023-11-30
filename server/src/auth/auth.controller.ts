import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PayloadLoginUserRequestDTO,
  PayloadRegisterUserRequestDTO,
  AuthUserResponseDTO,
} from './common/auth.dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 200, type: AuthUserResponseDTO })
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

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

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

    res.cookie('ml_uuid', refreshId, {
      httpOnly: true,
      maxAge: 360 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }
}
