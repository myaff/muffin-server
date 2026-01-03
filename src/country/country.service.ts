import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY } from './constants';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Country>
  ) {}

  findAll() {
    return this.repository.find({
      relations: { currency: true },
    });
  }

  findOne(iso2: string) {
    return this.repository.findOneBy({ iso2 });
  }
}
