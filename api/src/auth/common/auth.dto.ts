import { ApiProperty } from '@nestjs/swagger';

export class PayloadRegisterUserDTO {
  @ApiProperty({ example: 'Alex' })
  userName: string;

  @ApiProperty({ example: 'Alex@mail.ru' })
  email: string;

  @ApiProperty({ example: 'password_string' })
  password: string;
}

export class ResponseAuthUserDTO {
  @ApiProperty({ example: 'Alex' })
  userName: string;

  @ApiProperty({ example: 'Alex@mail.ru' })
  email: string;

  @ApiProperty({ example: 'token_string' })
  accessToken: string;
}
