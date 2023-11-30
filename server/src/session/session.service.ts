import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './session.entity';
import { Repository } from 'typeorm';
import {
  CreateSessionRequestDTO,
  UpdateSessionRequestDTO,
} from './common/session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async create(data: CreateSessionRequestDTO) {
    const session = this.sessionRepository.create(data);

    await this.sessionRepository.save(session);

    return session;
  }

  async getById(refreshId: string, isOutsideUse = false) {
    const session = await this.sessionRepository.findOne({
      where: { refreshId },
    });

    if (!session && isOutsideUse) {
      return null;
    }

    if (!session) {
      throw new HttpException('session_not_found', HttpStatus.NOT_FOUND);
    }

    return session;
  }

  async getByUser(userId: number, isOutsideUse = false) {
    const session = await this.sessionRepository.findOne({
      where: { userId },
    });

    if (!session && isOutsideUse) {
      return null;
    }

    if (!session) {
      throw new HttpException('session_not_found', HttpStatus.NOT_FOUND);
    }

    return session;
  }

  async update(data: UpdateSessionRequestDTO) {
    const session = await this.sessionRepository.findOne({
      where: { id: data?.id },
    });

    if (!session) {
      throw new HttpException('session_not_found', HttpStatus.NOT_FOUND);
    }

    const updateSession = { ...session, ...data };

    await this.sessionRepository.save(updateSession);
  }

  async delete(id: number) {
    if (!id) {
      return null;
    }

    await this.sessionRepository.delete({ id });

    return id;
  }
}
