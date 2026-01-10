import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { TransactionCategoryController } from './transaction-category.controller';
import { TransactionCategory } from './entities/transaction-category.entity';
import { TransactionCategoryService } from './transaction-category.service';

@Module({
  imports: [DBModule],
  controllers: [TransactionCategoryController],
  providers: [
    createProvider(REPOSITORY, TransactionCategory),
    TransactionCategoryService,
  ],
})
export class TransactionCategoryModule {}
