import { Injectable, Inject } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { REPOSITORY } from './constants';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Bank>
  ) {}

  create(userId: number, createBankDto: Omit<CreateBankDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createBankDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: { country: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: number, options: FindOptionsWhere<Bank>) {
    return this.repository.findOneBy({ user: { id: userId }, ...options });
  }

  update(userId: number, id: number, updateBankDto: UpdateBankDto) {
    return this.repository.update({ user: { id: userId }, id }, updateBankDto);
  }

  async remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
