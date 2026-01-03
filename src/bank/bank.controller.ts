import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(@Request() req, @Body() createBankDto: CreateBankDto) {
    return this.bankService.create(req.user.iss, createBankDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.bankService.findAll(req.user.iss);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bankService.findOne(req.user.iss, { id: +id });
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(req.user.iss, +id, updateBankDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bankService.remove(req.user.iss, +id);
  }
}
