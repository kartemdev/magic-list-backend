import { Controller, Get, UseGuards } from '@nestjs/common';

import { ResiduesService } from './residue.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifieGuard } from 'src/verifie/verifie.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from '@decorators/auth.decorators';

import { GetResiduesByUserIdResponseDTO } from './common/residues.dto';

@ApiBearerAuth()
@ApiTags('Остатки')
@UseGuards(AuthGuard, VerifieGuard)
@Controller('residues')
export class ResiduesController {
  constructor(private residueService: ResiduesService) {}

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

  @ApiOperation({
    summary: 'Получение тестовых остатков',
  })
  @ApiResponse({
    status: 200,
    type: GetResiduesByUserIdResponseDTO,
    isArray: true,
  })
  @Get('mock')
  getResiduesMock() {
    return this.residueService.getResiduesByUserId(1);
  }
}
