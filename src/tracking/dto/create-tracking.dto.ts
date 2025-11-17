import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { Mood } from "src/base/mood.embed";
import { RateVersion } from "src/rate/entities/rateVersion.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";

export class CreateTrackingDto {
  @IsNotEmpty()
  task: Task;

  @IsNotEmpty()
  user: User;

  @IsDateString()
  date: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  rateVersion: DeepPartial<RateVersion>;

  note: string;
  billable: boolean;
  mood: Mood | null;
}
