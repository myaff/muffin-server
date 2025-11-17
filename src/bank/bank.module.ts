import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { Bank } from './entities/bank.entity';
import { DBModule } from 'src/db/db.module';
import { REPOSITORY } from './constants';
import { createProvider } from 'src/utils/createProviders';

@Module({
  imports: [DBModule],
  controllers: [BankController],
  providers: [createProvider(REPOSITORY, Bank), BankService],
})
export class BankModule {}
