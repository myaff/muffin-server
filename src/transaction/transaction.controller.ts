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
import { TransactionService } from './transaction.service';
import { CreateTransactionApi, CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionApi, UpdateTransactionDto } from './dto/update-transaction.dto';
import type { UserRequest } from 'src/base/userRequest';
import { scaleMoney } from 'src/utils/money-scaler';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { isNumber, isString } from 'class-validator';
import { ensureArray } from 'src/utils/transformers';
import { BaseController, type QueryObject } from 'src/base/baseController';

@Controller('transaction')
export class TransactionController extends BaseController {
  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: CreateTransactionApi,
  ) {
    const item: CreateTransactionDto = {
      ...dto,
      amount: scaleMoney(dto.amount),
      user: { id: req.user.iss },
    };
    return this.transactionService
      .create(item)
      .then((item) => item.toPlainObject());
  }

  @Get()
  async findAll(
    @Request() req: UserRequest,
    @Query() q: QueryObject,
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const paginationOptions = this.getPaginationOptions(q);
    const whereOptions = {
      user: { id: req.user.iss },
      ...this.getFilterOptions(q),
    };
    const options: FindManyOptions<Transaction> = {
      where: whereOptions,
      order: { [sortBy]: order, 'createdAt': 'DESC' },
      ...paginationOptions,
    };
    const count = await this.transactionService.count({ where: whereOptions });
    const list = await this.transactionService.findAll(options);
    return {
      list: list.map(t => t.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<Transaction> = {
      user: { id: req.user.iss },
      id: Number.parseInt(id),
    };
    return this.transactionService
      .findOne(options)
      .then((item) => item.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionApi,
  ) {
    const options: FindOptionsWhere<Transaction> = {
      user: { id: req.user.iss },
      id: Number.parseInt(id),
    };
    const item: UpdateTransactionDto = {
      ...dto,
      id: Number.parseInt(id),
      amount: isNumber(dto?.amount)
        ? scaleMoney(dto.amount)
        : undefined,
    };
    return this.transactionService
      .update(options, item)
      .then((item) => item.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<Transaction> = {
      user: { id: req.user.iss },
      id: Number.parseInt(id),
    };
    return this.transactionService.remove(options);
  }

  getFilterOptions(query: QueryObject) {
    const options: FindOptionsWhere<Transaction> = {};
    if (!query || typeof query !== 'object') return options;
    if (isString(query.type)
        && Object.values<string>(TransactionType).includes(query.type)) {
        options.type = query.type as TransactionType;
    }
    if (query?.categories) {
      const normalized = ensureArray(query.categories)
        .map(Number)
        .filter(id => !!id);
      if (normalized.length) {
        options.categories = { id: In(normalized) };
      }
    }
    options.date = this.getDatesFilterOptions(query) ?? undefined;
    if (query?.bankAccounts) {
      const normalized = ensureArray(query.bankAccounts)
        .map(Number)
        .filter(id => !!id);
      if (normalized.length) {
        options.bankAccount = { id: In(normalized) };
      }
    }
    if (query?.clients) {
      const normalized = ensureArray(query.clients)
        .map(Number)
        .filter(id => !!id);
      if (normalized.length) {
        options.client = { id: In(normalized) };
      }
    }
    return options;
  }
}
