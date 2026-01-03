import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, Repository } from 'typeorm';
import { Project } from './entities/project.entity';

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
        client: true,
        ratePlan: { currency: true },
      },
      order: { active: 'DESC', createdAt: 'DESC' },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository
      .findOne({
        where: { user: { id: userId }, id },
        relations: {
          client: true,
          ratePlan: { currency: true },
          tasks: { status: true, tracking: { rateVersion: { ratePlan: { currency: true } } } },
        },
      });
  }

  update(userId: number, id: number, updateProjectDto: UpdateProjectDto) {
    return this.repository
      .save({
        user: { id: userId },
        id,
        ...updateProjectDto,
      })
      .then(() => this.findOne(userId, id));
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
