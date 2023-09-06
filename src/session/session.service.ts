import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './session.entity';
import { Repository } from 'typeorm';
import { CreateSessionDTO, UpdateSessionDTO } from './common/session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async create(data: CreateSessionDTO) {
    const session = this.sessionRepository.create(data);

    await this.sessionRepository.save(session);

    return session;
  }

  async get(token: string) {
    if (!token) {
      return null;
    }

    const session = await this.sessionRepository.findOne({
      where: { refreshToken: token },
    });

    return session;
  }

  async update(data: UpdateSessionDTO) {
    if (data) {
      const { id, refreshToken, userAgent } = data;

      if (id && refreshToken && userAgent) {
        const session = await this.sessionRepository.update(
          { id },
          { refreshToken, userAgent },
        );

        return session;
      }
    }
  }

  async delete(id: number) {
    if (!id) {
      return null;
    }
    await this.sessionRepository.delete({ id });
    return id;
  }
}
