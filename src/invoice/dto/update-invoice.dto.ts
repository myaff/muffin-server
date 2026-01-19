import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceApi, CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceApi extends PartialType(CreateInvoiceApi) {}

export type UpdateInvoiceDto = Partial<CreateInvoiceDto>;
