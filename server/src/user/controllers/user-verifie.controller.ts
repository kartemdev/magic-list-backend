import { UserId } from '@decorators/auth.decorators';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { VerifieGuard } from 'src/verifie/verifie.guard';
import { VerifieResponseDTO } from '../common/user.dto';
import { UserVerifieService } from '../services/user-verifie.service';

@ApiBearerAuth()
@ApiTags('Пользователь')
@UseGuards(AuthGuard, VerifieGuard)
@Controller('user')
export class UserVerifieController {
  constructor(private userVerifieService: UserVerifieService) {}

  @ApiOperation({
    summary: 'Получение данных о подтверждении действий пользователя',
  })
  @ApiResponse({ status: 200, type: VerifieResponseDTO })
  @Get('verifie')
  @UseGuards(AuthGuard)
  getVerifie(@UserId() userId: number) {
    return this.userVerifieService.getVerifie(userId);
  }

  @ApiOperation({
    summary:
      'Отправка письма с кодом подтверждения, первоначальной верификации',
  })
  @ApiResponse({ status: 200 })
  @Get('verifie/send-initial')
  @UseGuards(AuthGuard)
  sendInitial(@UserId() userId: number) {
    return this.userVerifieService.sendInitialVerifie(userId);
  }

  @ApiOperation({
    summary: 'Проверка кода подтверждения, первоначальной верификации',
  })
  @ApiResponse({ status: 200 })
  @Get('verifie/confirm-initial/:code')
  @UseGuards(AuthGuard)
  confirmInitial(@UserId() userId: number, @Param('code') code: string) {
    return this.userVerifieService.confirmInitialVerifie(userId, code);
  }
}
