import { Inject, Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Rate } from './entities/rate.entity';

@Injectable()
export class RateService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Rate>
  ) {}

  create(userId: number, createRateDto: Omit<CreateRateDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createRateDto});
  }

  findAll(userId: number, options?: FindOptionsWhere<Rate>) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: { currency: true, projects: true },
      order: { dateFrom: 'DESC', dateTo: 'DESC' },
    });
  }

  findOne(userId: number, id: number) {
    return this.repository.findBy({ user: { id: userId }, id });
  }

  update(userId: number, id: number, updateRateDto: UpdateRateDto) {
    return this.repository.update({ user: { id: userId }, id }, updateRateDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
