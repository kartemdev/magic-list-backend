import { UserEntity } from '../user.entity';

export class UserMapper {
  toResponseObject(user: UserEntity) {
    const { id, userName, email, createdAt } = user;

    return {
      id,
      userName,
      email,
      registerDate: createdAt,
    };
  }
}
