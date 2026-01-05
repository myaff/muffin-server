import { IsNotEmpty, IsNumber } from "class-validator";
import { Bank } from "src/bank/entities/bank.entity";
import { Country } from "src/country/entities/country.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";

export class CreateBankAccountDto {
  @IsNotEmpty()
  user: DeepPartial<User>;

  bank: DeepPartial<Bank>;

  @IsNotEmpty()
  country: DeepPartial<Country>;

  @IsNotEmpty()
  currency: DeepPartial<Currency>;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  startingBalance: number;

  @IsNumber()
  balance: number;
  active: boolean;
}
