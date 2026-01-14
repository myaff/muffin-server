import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { RatePlan } from '../entities/rate-plan.entity';

export class CreateRateVersionDto {
  @IsNotEmpty()
  user: Pick<User, 'id'>;

  @IsNotEmpty()
  ratePlan: Pick<RatePlan, 'id'>;

  @IsNumber()
  amount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate?: string;

  recurringCount: number;
  includedHours: number;
  overageHourly: number;
}
