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
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountApi, CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountApi, UpdateBankAccountDto } from './dto/update-bank-account.dto';
import type { UserRequest } from 'src/base/userRequest';
import { scaleMoney } from 'src/utils/money-scaler';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { isNumber } from 'class-validator';
import { BaseController, type QueryObject } from 'src/base/baseController';

@Controller('bank-account')
export class BankAccountController extends BaseController {
  constructor(private readonly bankAccountService: BankAccountService) {
    super();
    this.pageSize = 100;
  }

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() dto: CreateBankAccountApi,
  ) {
    const balanceScaled = scaleMoney(dto.startingBalance);
    const item: CreateBankAccountDto = {
      ...dto,
      user: { id: req.user.iss },
      startingBalance: balanceScaled,
      balance: balanceScaled,
    };
    return this.bankAccountService
      .create(item)
      .then(data => data.toPlainObject());
  }

  @Get()
  async findAll(@Request() req: UserRequest, @Query() query: QueryObject) {
    const paginationOptions = this.getPaginationOptions(query);
    const whereOptions = { user: { id: req.user.iss } };
    const options: FindManyOptions<BankAccount> = {
      where: whereOptions,
      order: { createdAt: 'DESC' },
      ...paginationOptions,
    };
    const count = await this.bankAccountService.count({ where: whereOptions });
    const list = await this.bankAccountService.findAll(options);
    return {
      list: list.map(i => i.toPlainObject()),
      ...this.getPaginationDto(paginationOptions, count),
    };
  }

  @Get(':id')
  findOne(@Request() req: UserRequest, @Param('id') id: string) {
    const options: FindOptionsWhere<BankAccount> = {
      user: { id: req.user.iss },
      id: Number.parseInt(id),
    };
    return this.bankAccountService
      .findOne(options)
      .then((item) => item.toPlainObject());
  }

  @Patch(':id')
  update(
    @Request() req: UserRequest,
    @Param('id') id: string,
    @Body() dto: UpdateBankAccountApi,
  ) {
    const options: FindOptionsWhere<BankAccount> = {
      user: { id: req.user.iss },
      id: Number.parseInt(id),
    };
    const item: UpdateBankAccountDto = {
      ...dto,
      startingBalance: isNumber(dto?.startingBalance)
        ? scaleMoney(dto.startingBalance)
        : undefined,
    };
    if ('balance' in item) delete item.balance;
    return this.bankAccountService
      .update(options, item)
      .then(data => data.toPlainObject());
  }

  @Delete(':id')
  remove(@Request() req: UserRequest, @Param('id') id: string) {
    return this.bankAccountService.remove(req.user.iss, +id);
  }
}
