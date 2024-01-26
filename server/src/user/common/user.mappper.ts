import { UserEntity } from '../user.entity';

export class UserMapper {
  toResponseObject(user: UserEntity) {
    const { id, userName, email, createdAt, isVerified } = user;

    return {
      id,
      userName,
      email,
      isVerified,
      registerDate: createdAt,
    };
  }
}
