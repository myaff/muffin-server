import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { getRateByDate } from 'src/utils/helpers';
import { Rate } from 'src/rate/entities/rate.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Task>
  ) {}

  create(userId: number, createTaskDto: Omit<CreateTaskDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createTaskDto});
  }

  findAll(userId: number, options?: FindManyOptions<Task>) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: {
        project: { rates: { currency: true } },
        status: true,
        //tracking: true
      },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository.findOne({
      where: { user: { id: userId }, id, },
      relations: {
        project: { rates: { currency: true } },
        status: true,
        tracking: true,
      },
    }).then(task => {
      const rates = new Set<Rate>();
      const tracking = task.tracking.map(record => {
        const rate = getRateByDate(task.project.rates, record.date);
        rates.add(rate);
        return {
          id: record.id,
          date: record.date,
          hours: record.hours,
          rate,
        }
      });
      const project = task.project;
      delete project.rates;
      return {
        id: task.id,
        title: task.title,
        status: task.status,
        url: task.url,
        active: task.active,
        code: task.code,
        project,
        tracking,
        rates: Array.from(rates),
      };
    });
  }

  update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    return this.repository.update({ user: { id: userId }, id }, updateTaskDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
