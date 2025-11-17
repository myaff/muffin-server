import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';

@Injectable()
export class TrackingService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Tracking>,
  ) {}

  create(userId: number, createTrackingDto: Omit<CreateTrackingDto, 'user'>[]) {
    return this.repository.save(createTrackingDto.map(item  => ({ user: { id: userId }, ...item })));
  }

  findAll(userId: number, options?: FindOptionsWhere<Tracking>) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: {
        task: true,
        rateVersion: { ratePlan: { currency: true } }
      },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository.findOneBy({ user: { id: userId }, id });
  }

  update(userId: number, id: number, updateTrackingDto: UpdateTrackingDto) {
    return this.repository.update({ user: { id: userId }, id }, updateTrackingDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
