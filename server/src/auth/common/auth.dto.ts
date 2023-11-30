import { ApiProperty } from '@nestjs/swagger';

export class PayloadLoginUserRequestDTO {
  @ApiProperty({ example: 'Alex@mail.ru' })
  email: string;

  @ApiProperty({ example: 'password_string' })
  password: string;
}

export class PayloadRegisterUserRequestDTO {
  @ApiProperty({ example: 'Alex' })
  userName: string;

  @ApiProperty({ example: 'Alex@mail.ru' })
  email: string;

  @ApiProperty({ example: 'password_string' })
  password: string;
}

export class AuthUserResponseDTO {
  @ApiProperty({ example: 'token_string' })
  accessToken: string;
}
