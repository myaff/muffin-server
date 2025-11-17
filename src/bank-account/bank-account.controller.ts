import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  create(@Request() req, @Body() createBankAccountDto: Omit<CreateBankAccountDto, 'user'>) {
    return this.bankAccountService.create(req.user.iss, createBankAccountDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.bankAccountService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bankAccountService.findOne(req.user.iss, { id: +id });
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountService.update(req.user.iss, +id, updateBankAccountDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bankAccountService.remove(req.user.iss, +id);
  }
}
