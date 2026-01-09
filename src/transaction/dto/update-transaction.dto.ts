import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionApi, CreateTransactionDto } from './create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

export class UpdateTransactionApi extends PartialType(CreateTransactionApi) {}

export type UpdateTransactionDto = Partial<CreateTransactionDto> & Pick<Transaction, 'id'>;
