import { Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { REPOSITORY } from './constants';

@Injectable()
export class ClientService {
  constructor(
    @Inject(REPOSITORY)
    private repository: Repository<Client>
  ) {}

  create(userId: number, createClientDto: Omit<CreateClientDto, 'user'>) {
    return this.repository.save({ user: { id: userId }, ...createClientDto });
  }

  findAll(userId: number, options?: FindManyOptions) {
    return this.repository.find({ 
      where: { user: { id: userId }, ...options },
      relations: { orgform: true },
      order: { active: 'DESC', createdAt: 'DESC' },
    });
  }

  findOne(userId: number, options: FindOptionsWhere<Client>) {
    return this.repository.findOneBy({ user: { id: userId }, ...options });
  }

  update(userId: number, id: number, updateClientDto: UpdateClientDto) {
    return this.repository.update({ user: { id: userId }, id }, updateClientDto);
  }

  async remove(userId: number, id: number) {
    return this.repository.delete({ user: { id: userId }, id });
  }
}
