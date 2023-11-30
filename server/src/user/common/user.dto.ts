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
}
