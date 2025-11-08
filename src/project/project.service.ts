import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Rate } from 'src/rate/entities/rate.entity';
import { isBefore, isSameDay } from 'date-fns';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { Task } from 'src/task/entities/task.entity';
import { sortRates } from 'src/utils/helpers';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Project>
  ) {}

  create(userId: number, createProjectDto: Omit<CreateProjectDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createProjectDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: {
        client: { orgform: true },
        rates: { currency: true },
      },
      order: { active: 'DESC', createdAt: 'DESC' },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository
      .findOne({
        where: { user: { id: userId }, id },
        relations: {
          client: { orgform: true },
          rates: { currency: true },
          tasks: { status: true, tracking: true },
        },
      })
      .then(data => {
        const rates = [...data.rates].sort(sortRates);
        const flatten = data.tasks.reduce((acc, task) => {
          acc.tracking.push(...task.tracking.map(tracking => ({
            ...tracking,
            rate: this.getTrackingRate(tracking, rates),
            task,
          })));
          delete task.tracking;
          acc.tasks.push(task);
          return acc;
        }, { tasks: [] as Task[], tracking: [] as Tracking[] })
        return {
          ...data,
          rates,
          ...flatten,
        };
      });
  }

  update(userId: number, id: number, updateProjectDto: UpdateProjectDto) {
    return this.repository.save({ user: { id: userId }, id, ...updateProjectDto });
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }

  private getTrackingRate(tracking: Tracking, rates: Rate[]) {
    if (!rates.length) return null;
    return rates.find(rate => this.isDateBeforeOrEqual(rate.dateFrom, tracking.date) && (!rate.dateTo || this.isDateBeforeOrEqual(tracking.date, rate.dateTo)));
  }

  private isDateBeforeOrEqual(date: string | number | Date, dateToCompare: string | number | Date) {
    return isBefore(date, dateToCompare) || isSameDay(date, dateToCompare);
  }
}
