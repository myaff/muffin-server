import { Inject, Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { REPOSITORY } from './constants';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Status>
  ) {}

  create(createStatusDto: CreateStatusDto) {
    return this.repository.save(createStatusDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return this.repository.update({ id }, updateStatusDto);
  }

  remove(id: number) {
    return this.repository.delete({ id });
  }
}
