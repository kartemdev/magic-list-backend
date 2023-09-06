import { UserEntity } from 'src/user/user.entity';
export class CreateSessionDTO {
  user: UserEntity;
  userAgent: string;
  refreshToken: string;
}

export class UpdateSessionDTO {
  id: number;
  userAgent: string;
  refreshToken: string;
}
