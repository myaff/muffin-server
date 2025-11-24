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
        project: {
          client: {
            ratePlan: {
              currency: true,
              versions: true,
            },
            country: { currency: true },
          },
        },
        user: { ratePlans: {
          currency: true,
          versions: true,
        } },
        status: true,
      },
    }).then(data => {
      return data.map(task => {
        const ratePlan = this.getRateForTask(task);
        delete task.user;
        delete task.project.client;
        return { ...task, ratePlan };
      })
    });
  }

  findOne(userId: number, id: number) {
    return this.repository.findOne({
      where: { user: { id: userId }, id, },
      relations: {
        project: {
          client: {
            ratePlan: {
              currency: true,
              versions: true,
            },
            country: { currency: true },
          },
        },
        user: { ratePlans: {
          currency: true,
          versions: true,
        } },
        status: true,
        tracking: { rateVersion: true },
      },
    }).then(task => {
      const ratePlan = this.getRateForTask(task);
      delete task.user;
      return { ...task, ratePlan };
    });
  }

  update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    return this.repository
      .update({ user: { id: userId }, id }, updateTaskDto)
      .then(() => this.findOne(userId, id));
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }

  getRateForTask(task: Task) {
    if (task.project.ratePlan) return task.project.ratePlan;
    if (task.project.client.ratePlan) return task.project.client.ratePlan;
    const currency = task.project.client.country.currency;
    return task.user.ratePlans.find(plan => plan.currency.id === currency.id);
  }
}
