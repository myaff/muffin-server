import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, Repository } from 'typeorm';
import { Task } from './entities/task.entity';

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
        project: true,
        status: true,
      },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository.findOne({
      where: { user: { id: userId }, id, },
      relations: {
        project: { ratePlan: { currency: true } },
        status: true,
        tracking: { rateVersion: { ratePlan: { currency: true } } },
      },
    });
  }

  update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    return this.repository.update({ user: { id: userId }, id }, updateTaskDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
