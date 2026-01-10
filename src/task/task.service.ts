import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Task>,
  ) {}

  create(dto: CreateTaskDto) {
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<Task>) {
    return this.repository
      .find({
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
        ...options,
      })
      .then(data => {
        return data.map(task => {
          const ratePlan = this.getRateForTask(task);
          return { ...task, ratePlan };
        });
      });
  }

  count(options: FindManyOptions<Task>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<Task>) {
    return this.repository
    .findOne({
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
      ...options,
    })
    .then(task => {
      if (!task) return task;
      const ratePlan = this.getRateForTask(task);
      return { ...task, ratePlan };
    });
  }

  async update(options: FindOptionsWhere<Task>, dto: UpdateTaskDto) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  remove(options: FindOptionsWhere<Task>) {
    return this.repository.delete(options);
  }

  getRateForTask(task: Task) {
    if (task.project.ratePlan) return task.project.ratePlan;
    if (task.project.client.ratePlan) return task.project.client.ratePlan;
    const currency = task.project.client.country.currency;
    return task.user.ratePlans.find(plan => plan.currency.id === currency.id);
  }
}
