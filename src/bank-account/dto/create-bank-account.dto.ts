import { IsNotEmpty, IsNumber } from 'class-validator';
import { Bank } from 'src/bank/entities/bank.entity';
import { Country } from 'src/country/entities/country.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateBankAccountApi {
  @IsNotEmpty()
  country: Pick<Country, 'iso2'>;

  @IsNotEmpty()
  currency: Pick<Currency, 'id'>;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  startingBalance: number;

  bank: Pick<Bank, 'id'>;
  active: boolean;
}

export type CreateBankAccountDto = Omit<CreateBankAccountApi,'startingBalance'>
  & {
    user: Pick<User, 'id'>;
    startingBalance: bigint;
    balance: bigint;
  };
