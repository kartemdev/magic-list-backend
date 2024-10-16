import { Controller, Get, UseGuards } from '@nestjs/common';

import { ResidueService } from './residue.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifieGuard } from 'src/verifie/verifie.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from '@decorators/auth.decorators';
import { ResidueEntity } from './residue.entity';
import { GetResiduesByUserIdResponseDTO } from './common/residue.dto';

@ApiBearerAuth()
@ApiTags('Остатки')
@UseGuards(AuthGuard, VerifieGuard)
@Controller('residue')
export class ResidueController {
  constructor(private residueService: ResidueService) {}

  @ApiOperation({
    summary: 'Получение остатков пользователя',
  })
  @ApiResponse({
    status: 200,
    type: GetResiduesByUserIdResponseDTO,
    isArray: true,
  })
  @Get()
  getResiduesByUserId(@UserId() userId: number) {
    return this.residueService.getResiduesByUserId(userId);
  }
}
