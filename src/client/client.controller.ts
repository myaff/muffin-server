import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import type { UserRequest } from 'src/base/userRequest';
import { BaseController, type QueryObject } from 'src/base/baseController';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientController extends BaseController {
  constructor(private readonly clientService: ClientService) {
    super();
    this.pageSize = 100;
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: Omit<CreateClientDto, 'user'>,
  ) {
    const item: CreateClientDto = {
      ...dto,
      user: { id: req.user.iss },
    };
    return this.clientService
      .create(item)
      .then(data => data.toPlainObject());
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const whereOptions: FindOptionsWhere<Client> = {
      user: { id: req.user.iss },
    };
    const options: FindManyOptions<Client> = {
      where: whereOptions,
      order: { active: 'DESC', createdAt: 'DESC' },
      ...paginationOptions,
    };
    const count = await this.clientService.count({ where: whereOptions });
    const list = await this.clientService.findAll(options);
    return {
      list: list.map(c => c.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOneOptions<Client> = {
      where: {
        id: +id,
        user: { id: req.user.iss },
       },
    };
    return this.clientService
      .findOne(options)
      .then(data => data.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    const options: FindOptionsWhere<Client> = {
      id: +id,
      user: { id: req.user.iss },
    };
    return this.clientService
      .update(options, dto)
      .then(data => data.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<Client> = {
      id: +id,
      user: { id: req.user.iss },
    };
    return this.clientService.remove(options);
  }
}
