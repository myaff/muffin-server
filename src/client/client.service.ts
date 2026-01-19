import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { REPOSITORY } from './constants';

@Injectable()
export class ClientService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Client>,
  ) {}

  create(dto: CreateClientDto) {
    return this.repository.save(dto);
  }

  findAll(options?: FindManyOptions<Client>) {
    return this.repository.find({
      relations: { country: { currency: true } },
      ...options,
    });
  }

  count(options: FindManyOptions<Client>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<Client>) {
    return this.repository.findOneOrFail({
      relations: { country: { currency: true } },
      ...options,
    });
  }

  update(options: FindOptionsWhere<Client>, updateClientDto: UpdateClientDto) {
    return this.repository
      .update(options, updateClientDto)
      .then(() => this.findOne({ where: options }));
  }

  async remove(options: FindOptionsWhere<Client>) {
    return this.repository.delete(options);
  }
}
