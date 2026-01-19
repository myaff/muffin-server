import { ArrayNotEmpty, IsDateString, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/user/entities/user.entity';
import { InvoiceStatus } from '../entities/invoice.entity';
import { CreateInvoiceEntryApi } from './create-invoice-entry.dto';
import { Project } from 'src/project/entities/project.entity';
import { RateType } from 'src/rate/constants';

export class CreateInvoiceApi {
  @IsNotEmpty()
  client: Pick<Client, 'id'>;

  project?: Pick<Project, 'id'>;

  @IsNotEmpty()
  currency: Pick<Currency, 'id'>;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  issuedDate?: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsIn(Object.values(InvoiceStatus))
  status: InvoiceStatus;

  @IsIn(Object.values(RateType))
  type: RateType;

  @ArrayNotEmpty()
  entries: CreateInvoiceEntryApi[];
}

export type CreateInvoiceDto = Omit<CreateInvoiceApi, 'entries'>
  & {
    user: Pick<User, 'id'>;
  };
