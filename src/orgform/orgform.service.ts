import { Inject, Injectable } from '@nestjs/common';
import { CreateOrgformDto } from './dto/create-orgform.dto';
import { UpdateOrgformDto } from './dto/update-orgform.dto';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Orgform } from './entities/orgform.entity';

@Injectable()
export class OrgformService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Orgform>
  ) {}

  create(createOrgformDto: CreateOrgformDto) {
    return this.repository.save(createOrgformDto);
  }

  findAll(options?: FindOptionsWhere<Orgform>) {
    return this.repository.findBy(options ?? {});
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateOrgformDto: UpdateOrgformDto) {
    return this.repository.update({ id }, updateOrgformDto);
  }

  remove(id: number) {
    return this.repository.delete({ id });
  }
}
