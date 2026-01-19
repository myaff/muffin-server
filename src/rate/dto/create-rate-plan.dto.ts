import { IsISO4217CurrencyCode, IsNotEmpty } from 'class-validator';
import { Currency } from 'src/currency/entities/currency.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { RateType, RateRecurringUnit, RateScope } from '../constants';
import { Client } from 'src/client/entities/client.entity';
import { CreateRateVersionApi } from './create-rate-version.dto';

export class CreateRatePlanDto {
  @IsISO4217CurrencyCode()
  currency: Pick<Currency, 'id'>;

  user: Pick<User, 'id'>;
  client?: Pick<Client, 'id'>;
  project?: Pick<Project, 'id'>;
  name: string;
  type: RateType;
  recurringUnit?: RateRecurringUnit;
  scope: RateScope;
  active: boolean;

  @IsNotEmpty()
  version: CreateRateVersionApi;
}
