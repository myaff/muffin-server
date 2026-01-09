import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Public } from 'src/utils/decorators/public';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(id);
  }
}
