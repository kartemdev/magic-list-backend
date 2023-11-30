import { UserEntity } from 'src/user/user.entity';
export class CreateSessionRequestDTO {
  user: UserEntity;
  userAgent: string;
  refreshId: string;
  expiresIn: number;
}

export class UpdateSessionRequestDTO {
  id: number;
  userAgent: string;
  refreshId: string;
  expiresIn: number;
}
