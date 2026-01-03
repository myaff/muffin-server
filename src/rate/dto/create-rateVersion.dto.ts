import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";
import { RatePlan } from "../entities/ratePlan.entity";

export class CreateRateVersionDto {
  @IsNotEmpty()
  ratePlan: RatePlan;

  @IsNumber()
  amount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string | null;

  user: DeepPartial<User>;
  recurringCount: number;
  includedHours: number;
  overageHourly: number;
}