import { IsDateString, IsISO4217CurrencyCode, IsNumber } from "class-validator";
import { Currency } from "src/currency/entities/currency.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";
import { RateType, RateRecurringUnit } from "../constants";

export class CreateRateDto {
  @IsISO4217CurrencyCode()
  currency: DeepPartial<Currency>;

  @IsNumber()
  amount: number;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string | null;

  user: DeepPartial<User>;
  project: DeepPartial<Project>;
  type: RateType;
  recurringUnit: RateRecurringUnit | null;
}