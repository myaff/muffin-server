import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { REPOSITORY } from './constants';
import { createProvider } from 'src/utils/createProviders';
import { Country } from './entities/country.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [CountryController],
  providers: [createProvider(REPOSITORY, Country), CountryService],
})
export class CountryModule {}
