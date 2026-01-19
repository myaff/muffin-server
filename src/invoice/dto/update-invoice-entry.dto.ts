import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceEntryApi, CreateInvoiceEntryDto } from './create-invoice-entry.dto';

export class UpdateInvoiceEntryApi extends PartialType(CreateInvoiceEntryApi) {}

export type UpdateInvoiceEntryDto = Partial<CreateInvoiceEntryDto>
