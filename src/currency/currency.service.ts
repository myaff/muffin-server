import { Inject, Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject(REPOSITORY)
    private repository: Repository<Currency>
  ) {}

  create(createCurrencyDto: CreateCurrencyDto) {
    return this.repository.save(createCurrencyDto);
  }

  findAll(options?: FindOptionsWhere<Currency>) {
    return this.repository.findBy(options);
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    return this.repository.update({ id }, updateCurrencyDto);
  }

  remove(id: string) {
    return this.repository.delete({ id });
  }
}
