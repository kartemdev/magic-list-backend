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

  async get(refreshId: string) {
    if (!refreshId) {
      return null;
    }

    const session = await this.sessionRepository.findOne({
      where: { refreshId },
    });

    return session;
  }

  async getByUser(userId: number) {
    if (!userId) {
      return null;
    }

    const session = await this.sessionRepository.findOne({
      where: { userId },
    });

    return session;
  }

  async update(data: UpdateSessionDTO) {
    if (data?.id) {
      const { id, refreshId, userAgent, expiresIn } = data;

      const session = await this.sessionRepository.update(
        { id },
        { refreshId, userAgent, expiresIn },
      );

      return session;
    }
    return null;
  }

  async delete(id: number) {
    if (!id) {
      return null;
    }
    await this.sessionRepository.delete({ id });
    return id;
  }
}
