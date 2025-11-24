import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { Public } from 'src/utils/decorators/public';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }
}
