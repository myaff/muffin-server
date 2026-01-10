import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { DBModule } from 'src/db/db.module';
import { Transaction } from './entities/transaction.entity';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { BankAccountModule } from 'src/bank-account/bank-account.module';

@Module({
  imports: [DBModule, BankAccountModule],
  controllers: [TransactionController],
  providers: [createProvider(REPOSITORY, Transaction), TransactionService],
})
export class TransactionModule {}
