import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { Client } from 'src/client/entities/client.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
import { TransactionType } from '../entities/transaction.entity';
import { IsDateString, IsIn, IsNotEmpty, IsPositive } from 'class-validator';
import { TransactionCategory } from 'src/transaction-category/entities/transaction-category.entity';

export class CreateTransactionApi {
  invoice?: Pick<Invoice, 'id'>;
  client?: Pick<Client, 'id'>;

  @IsNotEmpty()
  bankAccount: Pick<BankAccount, 'id'>;

  @IsDateString()
  date: string;

  @IsPositive()
  amount: number;

  @IsIn(Object.values(TransactionType))
  type: TransactionType;
  categories?: Pick<TransactionCategory, 'id'>[];
}

export type CreateTransactionDto = Omit<CreateTransactionApi, 'amount'> & {
  user: Pick<User, 'id'>;
  amount: bigint;
};
