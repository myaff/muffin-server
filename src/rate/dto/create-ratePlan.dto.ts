import { IsISO4217CurrencyCode } from "class-validator";
import { Currency } from "src/currency/entities/currency.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";
import { RateType, RateRecurringUnit, RateScope } from "../constants";
import { Client } from "src/client/entities/client.entity";

export class CreateRatePlanDto {
  @IsISO4217CurrencyCode()
  currency: DeepPartial<Currency>;

  user: DeepPartial<User>;
  client: DeepPartial<Client>;
  project: DeepPartial<Project>;
  name: string;
  type: RateType;
  recurringUnit: RateRecurringUnit | null;
  scope: RateScope;
  active: boolean;
}