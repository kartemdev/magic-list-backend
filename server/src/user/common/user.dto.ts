import { ApiProperty } from '@nestjs/swagger';

// ---------- RequestDTOs ----------

export class CreateUserRequestDTO {
  userName: string;
  email: string;
  password: string;
}

export class UpdateUserInfoRequestDTO {
  @ApiProperty({ example: 'michael' })
  userName: string;

  @ApiProperty({ example: 'michael@gmail.com' })
  email: string;
}

// ---------- ResponseDTOs ----------

export class UserInfoResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'alex' })
  userName: string;

  @ApiProperty({ example: 'alex@mail.ru' })
  email: string;

  @ApiProperty({ example: new Date() })
  registerDate: string;

  @ApiProperty({ example: false })
  isVerified: boolean;
}

export class VerifieResponseDTO {
  @ApiProperty({ example: 1706272992178 })
  verifieCodeCreatedTime: number;

  @ApiProperty({ example: true })
  isExpiresVerife: boolean;
}
