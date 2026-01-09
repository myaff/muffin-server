import { PartialType } from '@nestjs/mapped-types';
import { CreateBankAccountApi, CreateBankAccountDto } from './create-bank-account.dto';

export class UpdateBankAccountApi extends PartialType(CreateBankAccountApi) {}

export type UpdateBankAccountDto = Partial<CreateBankAccountDto>
