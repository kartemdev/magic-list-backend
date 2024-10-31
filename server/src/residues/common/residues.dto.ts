// ---------- ResponseDTOs ----------

import { ApiProperty } from '@nestjs/swagger';

export class GetResiduesByUserIdResponseDTO {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: '43' })
  article: number;

  @ApiProperty({ example: 'Apple Iphone 16 Pro Max' })
  product: string;

  @ApiProperty({ example: '76' })
  residue: number;

  @ApiProperty({ example: '103230.10' })
  unitPrice: number;

  @ApiProperty({ example: '2024-10-18T20:59:42.000Z' })
  createAt: string;
}
