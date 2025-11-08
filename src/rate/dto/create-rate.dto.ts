import { IsDateString, IsISO4217CurrencyCode, IsNumber } from "class-validator";
import { Currency } from "src/currency/entities/currency.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";

export class CreateRateDto {
  @IsISO4217CurrencyCode()
  currency: DeepPartial<Currency>;

  @IsNumber()
  value: number;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string | null;

  user: DeepPartial<User>;
  project: DeepPartial<Project>;
}