import { Inject, Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { REPOSITORY } from './constants';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<BankAccount>,
  ) {}

  create(
    userId: number,
    createBankAccountDto: Omit<CreateBankAccountDto, 'user'>,
  ) {
    const entity: DeepPartial<BankAccount> = { ...createBankAccountDto };
    entity.user = { id: userId };
    entity.startingBalance = this.scaleMoney(entity?.startingBalance ?? 0);
    entity.balance = entity.startingBalance;
    return this.repository.save(entity);
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository
      .find({
        where: { user: { id: userId }, ...options },
        relations: { bank: { country: true }, country: true, currency: true },
        order: { createdAt: 'DESC' },
      })
      .then((data) =>
        data.map((item) => ({
          ...item,
          startingBalance: this.unscaleMoney(item.startingBalance),
          balance: this.unscaleMoney(item.balance),
        })),
      );
  }

  findOne(userId: number, options: FindOptionsWhere<BankAccount>) {
    return this.repository
      .findOne({
        where: { user: { id: userId }, ...options },
        relations: { bank: { country: true }, country: true, currency: true },
      })
      .then((item) => {
        if (!item) return item;
        return {
          ...item,
          startingBalance: this.unscaleMoney(item.startingBalance),
          balance: this.unscaleMoney(item.balance),
        };
      });
  }

  async update(
    userId: number,
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const criteria: FindOptionsWhere<BankAccount> = {
      user: { id: userId },
      id,
    };
    const entity: DeepPartial<BankAccount> = { ...updateBankAccountDto };
    entity.startingBalance = this.scaleMoney(entity?.startingBalance ?? 0);
    entity.balance = this.scaleMoney(entity.balance ?? entity.startingBalance);
    await this.repository.update(criteria, entity);
    return this.findOne(userId, { id });
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }

  scaleMoney(value: number) {
    return Math.round(value * 100);
  }

  unscaleMoney(value: number) {
    return value / 100;
  }
}
