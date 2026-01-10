import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Bank>
  ) {}

  findAll(options: FindOptionsWhere<Bank>) {
    return this.repository.find({
      relations: { country: true },
      where: options,
    });
  }

  findOne(options: FindOptionsWhere<Bank>) {
    return this.repository.findOneBy(options);
  }
}
