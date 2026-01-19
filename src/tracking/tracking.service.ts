import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { REPOSITORY } from './constants';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { DATA_SOURCE } from 'src/utils/constants';
import { RateVersion } from 'src/rate/entities/rate-version.entity';

@Injectable()
export class TrackingService {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(REPOSITORY)
    private readonly repository: Repository<Tracking>,
  ) {}

  create(dtos: CreateTrackingDto[]) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Tracking);
      const rateVersionRepo = manager.getRepository(RateVersion);
      const created = await repo.save(dtos);
      const versions = Array.from(created.reduce((acc, item) => {
        acc.add(item.id);
        return acc;
      }, new Set<RateVersion['id']>()));
      await rateVersionRepo.update({ id: In(versions) }, { deletable: false });
      return created;
    });
  }

  findAll(options: FindManyOptions<Tracking>) {
    return this.repository.find({
      relations: {
        task: true,
        rateVersion: { ratePlan: { currency: true } },
        invoice: true,
      },
      ...options,
    });
  }

  count(options: FindManyOptions<Tracking>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<Tracking>) {
    return this.repository.findOneOrFail(options);
  }

  async update(options: FindOptionsWhere<Tracking>, dto: UpdateTrackingDto) {
    const old = await this.findOne({ where: options });
    const item = {
      ...old,
      ...dto,
    };
    return this.repository.save(item);
  }

  remove(options: FindOptionsWhere<Tracking>) {
    return this.repository.delete(options);
  }
}
