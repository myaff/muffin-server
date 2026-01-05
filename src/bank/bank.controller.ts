import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { BankService } from './bank.service';
import { ILike } from 'typeorm';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  findAll(@Request() _req, @Query('country') country: string, @Query('query') query: string) {
    return this.bankService.findAll({
      country: { iso2: country },
      name: ILike(`%${query}%`),
    });
  }

  @Get(':id')
  findOne(@Request() _req, @Param('id') id: string) {
    return this.bankService.findOne({ bic11: id });
  }
}
