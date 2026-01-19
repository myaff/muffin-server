import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import {
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

  create(dto: CreateBankAccountDto) {
    return this.repository.save(dto);
  }

  findAll(options?: FindManyOptions<BankAccount>) {
    return this.repository.find({
      relations: { bank: { country: true }, country: true, currency: true },
      ...options,
    });
  }

  count(options: FindManyOptions<BankAccount>) {
    return this.repository.count(options);
  }

  findOne(options: FindOptionsWhere<BankAccount>) {
    return this.repository
      .findOneOrFail({
        where: options,
        relations: { bank: { country: true }, country: true, currency: true },
      });
  }

  async update(
    options: FindOptionsWhere<BankAccount>,
    dto: UpdateBankAccountDto,
  ) {
    const old = await this.findOne(options).then(item => {
      if (!item) return item;
      return {
        ...item,
        startingBalance: BigInt(item.startingBalance),
        balance: BigInt(item.balance),
      };
    });
    if (!old) throw new NotFoundException('Bank account was not fount');
    const item = {
      ...old,
      ...dto,
    };
    if (old.startingBalance !== item.startingBalance) {
      const diff = item.startingBalance - old.startingBalance;
      item.balance = item.balance + diff;
    }
    await this.repository.update(options, item);
    return this.findOne(options);
  }

  async updateBalance(id: number, value: bigint) {
    const item = await this.repository.findOneByOrFail({ id });
    item.balance = BigInt(item.balance) + value;
    const updRes = await this.repository.update({ id }, item);
    if (updRes.affected === 1) return item;
    throw new InternalServerErrorException();
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
