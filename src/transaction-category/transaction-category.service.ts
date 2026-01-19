import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { TransactionCategory } from './entities/transaction-category.entity';
import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';

@Injectable()
export class TransactionCategoryService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<TransactionCategory>,
  ) {}

  create(dto: CreateTransactionCategoryDto) {
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<TransactionCategory>) {
    return this.repository.find(options);
  }

  count(options: FindManyOptions<TransactionCategory>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<TransactionCategory>) {
    return this.repository.findOneOrFail(options);
  }

  async update(
    options: FindOptionsWhere<TransactionCategory>,
    dto: UpdateTransactionCategoryDto,
  ) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  remove(options: FindOptionsWhere<TransactionCategory>) {
    return this.repository.delete(options);
  }
}
