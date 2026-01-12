import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { Mood } from "src/base/mood.embed";
import { RateVersion } from "src/rate/entities/rate-version.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";

export class CreateTrackingDto {
  @IsNotEmpty()
  task: DeepPartial<Task>;

  @IsNotEmpty()
  user: DeepPartial<User>;

  @IsDateString()
  date: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  rateVersion: DeepPartial<RateVersion>;

  note: string;
  billable: boolean;
  mood?: Mood;
}
