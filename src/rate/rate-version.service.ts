import { Inject, Injectable } from '@nestjs/common';
import { VERSION_REPOSITORY } from './constants';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { RateVersion } from './entities/rate-version.entity';
import { CreateRateVersionDto } from './dto/create-rate-version.dto';
import { UpdateRateVersionDto } from './dto/update-rate-version.dto';

@Injectable()
export class RateVersionService {
  constructor(
    @Inject(VERSION_REPOSITORY)
    private readonly repository: Repository<RateVersion>,
  ) {}

  create(dto: CreateRateVersionDto) {
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<RateVersion>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<RateVersion>) {
    return this.repository.findOne(options);
  }

  async update(options: FindOptionsWhere<RateVersion>, dto: UpdateRateVersionDto) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  updateMany(options: FindOptionsWhere<RateVersion>, dto: UpdateRateVersionDto) {
    return this.repository.update(options, dto);
  }

  remove(options: FindOptionsWhere<RateVersion>) {
    return this.repository.delete(options);
  }
}
