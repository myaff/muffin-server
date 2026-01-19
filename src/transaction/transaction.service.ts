import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { BankAccountService } from 'src/bank-account/bank-account.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Transaction>,
    private readonly bankAccountService: BankAccountService,
  ) {}

  async create(dto: CreateTransactionDto) {
    await this.bankAccountService.updateBalance(
      dto.bankAccount.id,
      this.getDiff(dto),
    );
    return this.repository.save(dto);
  }

  findAll(options: FindManyOptions<Transaction>) {
    return this.repository
      .find({
        ...options,
        relations: {
          bankAccount: { currency: true },
          categories: true,
        },
      });
  }

  count(options: FindManyOptions<Transaction>) {
    return this.repository.count(options);
  }

  findOne(options: FindOptionsWhere<Transaction>) {
    return this.repository
      .findOneOrFail({
        where: options,
        relations: {
          bankAccount: { currency: true },
          categories: true,
        },
      });
  }

  async update(options: FindOptionsWhere<Transaction>, dto: UpdateTransactionDto) {
    const old = await this.findOne(options);
    const item = { ...old, ...dto };
    if (old.amount !== item.amount
        || old.type !== item.type
        || old.bankAccount.id !== item.bankAccount.id) {
      await this.bankAccountService.updateBalance(
        old.bankAccount.id,
        this.getDiff(old) * -1n,
      );
      await this.bankAccountService.updateBalance(
        item.bankAccount.id,
        this.getDiff(item),
      );
    }
    return await this.repository.save({ ...item });
  }

  async remove(options: FindOptionsWhere<Transaction>) {
    const item = await this.findOne(options);
    if (!item) throw new NotFoundException('Transaction was not found');
    await this.bankAccountService.updateBalance(item.bankAccount.id, this.getDiff(item) * -1n);
    return this.repository.delete(options);
  }

  getDiff(transaction: Pick<Transaction, 'amount' | 'type'>) {
    const mult = transaction.type === TransactionType.EXPENSE ? -1 : 1;
    return BigInt(transaction.amount) * BigInt(mult);
  }
}
