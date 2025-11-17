import { Inject, Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<BankAccount>
  ) {}

  create(userId: number, createBankAccountDto: Omit<CreateBankAccountDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createBankAccountDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: { bank: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: number, options: FindOptionsWhere<BankAccount>) {
    return this.repository.findOneBy({ user: { id: userId }, ...options });
  }

  update(userId: number, id: number, updateBankAccountDto: UpdateBankAccountDto) {
    return this.repository.update({ user: { id: userId }, id }, updateBankAccountDto);
  }

  remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
