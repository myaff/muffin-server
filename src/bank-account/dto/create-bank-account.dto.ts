import { IsNotEmpty, IsNumber } from "class-validator";
import { Bank } from "src/bank/entities/bank.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";

export class CreateBankAccountDto {
  @IsNotEmpty()
  bank: DeepPartial<Bank>;
  user: DeepPartial<User>

  @IsNotEmpty()
  currency: DeepPartial<Currency>;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  startingBalance: number;
}
