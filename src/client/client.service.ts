import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { REPOSITORY } from './constants';

@Injectable()
export class ClientService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<Client>
  ) {}

  create(userId: number, createClientDto: Omit<CreateClientDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createClientDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({
      where: { user: { id: userId }, ...options },
      relations: { country: { currency: true } },
      order: { active: 'DESC', createdAt: 'DESC' },
    });
  }

  findOne(userId: number, options: FindOneOptions<Client>) {
    return this.repository.findOne({
      ...options,
      where: { user: { id: userId }, ...options.where },
      relations: { country: { currency: true } },
    });
  }

  update(userId: number, id: number, updateClientDto: UpdateClientDto) {
    return this.repository
      .update({ user: { id: userId }, id }, updateClientDto)
      .then(() => this.findOne(userId, { where: { id }}));
  }

  async remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
