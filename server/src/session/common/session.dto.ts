import { UserEntity } from 'src/user/user.entity';
export class CreateSessionDTO {
  user: UserEntity;
  userAgent: string;
  refreshId: string;
  expiresIn: number;
}

export class UpdateSessionDTO {
  id: number;
  userAgent: string;
  refreshId: string;
  expiresIn: number;
}
