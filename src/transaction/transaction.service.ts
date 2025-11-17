import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Transaction>
  ) {}

  create(userId: number, createTransactionDto: Omit<CreateTransactionDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createTransactionDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: number, options: FindOptionsWhere<Transaction>) {
    return this.repository.findOneBy({ user: { id: userId }, ...options });
  }

  update(userId: number, id: number, updateTransactionDto: UpdateTransactionDto) {
    return this.repository.update({ user: { id: userId }, id }, updateTransactionDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
