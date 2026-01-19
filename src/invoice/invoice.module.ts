import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { createProvider } from 'src/utils/createProviders';
import { ENTRY_REPOSITORY, REPOSITORY } from './constants';
import { Invoice } from './entities/invoice.entity';
import { InvoiceEntry } from './entities/invoice-entry.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [InvoiceController],
  providers: [
    createProvider(REPOSITORY, Invoice),
    createProvider(ENTRY_REPOSITORY, InvoiceEntry),
    InvoiceService,
  ],
  exports: [InvoiceService],
})
export class InvoiceModule {}
