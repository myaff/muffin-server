import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Invoice } from '../entities/invoice.entity';

export class CreateInvoiceEntryApi {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  key: string;
}

export type CreateInvoiceEntryDto = Omit<CreateInvoiceEntryApi,'pricePerUnit'>
  & {
    user: Pick<User, 'id'>;
    invoice: Pick<Invoice, 'id'>;
  };
