import { Inject, Injectable } from '@nestjs/common';
import { PLAN_REPOSITORY } from './constants';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { RatePlan } from './entities/rate-plan.entity';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';

@Injectable()
export class RatePlanService {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly repository: Repository<RatePlan>,
  ) {}

  create(dto: CreateRatePlanDto) {
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<RatePlan>) {
    return this.repository.findAndCount({
      relations: {
        currency: true,
        versions: true,
        client: true,
        project: true,
      },
      ...options,
    });
  }

  findOne(options: FindOneOptions<RatePlan>) {
    return this.repository.findOne({
      relations: {
        currency: true,
        versions: true,
        client: true,
        project: true,
      },
      ...options,
    });
  }

  async update(options: FindOptionsWhere<RatePlan>, dto: UpdateRatePlanDto) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  remove(options: FindOptionsWhere<RatePlan>) {
    return this.repository.delete(options);
  }
}
