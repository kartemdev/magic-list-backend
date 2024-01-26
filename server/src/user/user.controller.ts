import { UserId } from '@decorators/auth.decorators';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import {
  UserInfoResponseDTO,
  UpdateUserInfoRequestDTO,
  VerifieResponseDTO,
} from './common/user.dto';

@ApiBearerAuth()
@ApiTags('Пользователь')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Получение информации о пользователе' })
  @ApiResponse({ status: 200, type: UserInfoResponseDTO })
  @Get('info')
  @UseGuards(AuthGuard)
  getUserInfo(@UserId() userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @ApiOperation({ summary: 'Изменение информации пользователя' })
  @ApiResponse({ status: 200 })
  @Patch('info')
  @UseGuards(AuthGuard)
  updateUserInfo(
    @UserId() userId: number,
    @Body() data: UpdateUserInfoRequestDTO,
  ) {
    return this.userService.updateUserInfo(userId, data);
  }

  @ApiOperation({
    summary:
      'Получение даты создания данных подтверждения действий пользователя',
  })
  @ApiResponse({ status: 200, type: VerifieResponseDTO })
  @Get('verifie')
  @UseGuards(AuthGuard)
  getVerifie(@UserId() userId: number) {
    return this.userService.getVerifieCreatedTime(userId);
  }

  @ApiOperation({ summary: 'Отправка письма с кодом подтверждения' })
  @ApiResponse({ status: 200 })
  @Get('send-verifie')
  @UseGuards(AuthGuard)
  sendVerifie(@UserId() userId: number) {
    return this.userService.sendVerifie(userId);
  }

  @ApiOperation({ summary: 'Проверка кода подтверждения' })
  @ApiResponse({ status: 200 })
  @Get('confirm-verifie/:code')
  @UseGuards(AuthGuard)
  confirmVerifie(@UserId() userId: number, @Param('code') code: string) {
    return this.userService.confirmVerifie(userId, code);
  }
}
