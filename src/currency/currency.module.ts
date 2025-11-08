import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Currency } from './entities/currency.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [CurrencyController],
  providers: [createProvider(REPOSITORY, Currency), CurrencyService],
})
export class CurrencyModule {}
