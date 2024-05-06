import { UserId } from '@decorators/auth.decorators';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from '../services/user.service';
import { UpdateUserInfoRequestDTO, UserInfoResponseDTO } from '../common/user.dto';


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
}
