// ---------- ResponseDTOs ----------

import { ApiProperty } from '@nestjs/swagger';

export class GetResiduesByUserIdResponseDTO {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: '43' })
  article: bigint;

  @ApiProperty({ example: 'Apple Iphone 16 Pro Max' })
  product: string;

  @ApiProperty({ example: '76' })
  residue: bigint;

  @ApiProperty({ example: '103 230' })
  unitPrice: bigint;

  @ApiProperty({ example: '2024-10-18T20:59:42.000Z' })
  createAt: string;
}
