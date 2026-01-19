import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Project>,
  ) {}

  create(dto: CreateProjectDto) {
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<Project>) {
    return this.repository.find({
      relations: {
        client: { country: { currency: true } },
        ratePlan: { currency: true },
      },
      ...options,
    });
  }

  count(options: FindManyOptions<Project>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<Project>) {
    return this.repository
      .findOneOrFail({
        relations: {
          client: { country: { currency: true } },
          ratePlan: { currency: true },
          tasks: { status: true, tracking: { rateVersion: { ratePlan: { currency: true } } } },
        },
        ...options,
      });
  }

  async update(options: FindOptionsWhere<Project>, dto: UpdateProjectDto) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  remove(options: FindOptionsWhere<Project>) {
    return this.repository.delete(options);
  }
}
