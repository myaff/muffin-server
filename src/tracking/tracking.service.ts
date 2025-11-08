import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { getRateByDate } from 'src/utils/helpers';

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
    //console.log(options);
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: { task: { project: { rates: { currency: true } } } },
    }).then(list => list.map(tracking => {
      const task = tracking.task;
      const project = task.project;
      const rate = getRateByDate(project.rates, tracking.date);
      delete task.project;
      delete project.rates;
      return {
        id: tracking.id,
        date: tracking.date,
        hours: tracking.hours,
        note: tracking.note,
        task,
        project,
        rate,
      };
    }));
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
