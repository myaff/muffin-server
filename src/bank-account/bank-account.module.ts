import { Module } from '@nestjs/common';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { DBModule } from 'src/db/db.module';
import { BankAccountController } from './bank-account.controller';
import { BankAccount } from './entities/bank-account.entity';
import { BankAccountService } from './bank-account.service';

@Module({
  imports: [DBModule],
  controllers: [BankAccountController],
  providers: [createProvider(REPOSITORY, BankAccount), BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
