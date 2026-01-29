import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource, EntityManager, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { DATA_SOURCE } from 'src/utils/constants';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(REPOSITORY)
    private readonly repository: Repository<Transaction>,
    private readonly bankAccountService: BankAccountService,
  ) {}

  async create(dto: CreateTransactionDto) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Transaction);
      await this.bankAccountService.updateBalance(
        dto.bankAccount.id,
        this.getDiff(dto),
        manager,
      );
      const item = await repo.save(this.repository.create(dto), { reload: true });
      return this.findOne({ id: item.id }, manager);
    });
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

  findOne(options: FindOptionsWhere<Transaction>, manager: EntityManager = this.dataSource.manager) {
    const repo = manager.getRepository(Transaction);
    return repo
      .findOneOrFail({
        where: options,
        relations: {
          bankAccount: { currency: true },
          categories: true,
        },
      });
  }

  async update(options: FindOptionsWhere<Transaction>, dto: UpdateTransactionDto) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Transaction);
      const old = await this.findOne(options, manager);
      const item = { ...old, ...dto };
      if (old.amount !== item.amount
          || old.type !== item.type
          || old.bankAccount.id !== item.bankAccount.id) {
        await this.bankAccountService.updateBalance(
          old.bankAccount.id,
          this.getDiff(old) * -1n,
          manager,
        );
        await this.bankAccountService.updateBalance(
          item.bankAccount.id,
          this.getDiff(item),
          manager,
        );
      }
      return await repo.save({ ...item });
    });
  }

  async remove(options: FindOptionsWhere<Transaction>) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Transaction);
      const item = await this.findOne(options, manager);
      await this.bankAccountService.updateBalance(
        item.bankAccount.id,
        this.getDiff(item) * -1n,
        manager,
      );
      return await repo.delete(options);
    });
  }

  getDiff(transaction: Pick<Transaction, 'amount' | 'type'>) {
    const mult = transaction.type === TransactionType.EXPENSE ? -1 : 1;
    return BigInt(transaction.amount) * BigInt(mult);
  }
}
