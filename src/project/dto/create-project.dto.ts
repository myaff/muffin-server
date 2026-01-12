import { IsDateString, IsNotEmpty } from "class-validator";
import { Estimate } from "src/base/estimate.embed";
import { Mood } from "src/base/mood.embed";
import { Client } from "src/client/entities/client.entity";
import { Rate } from "src/rate/entities/rate.entity";
import { RatePlan } from "src/rate/entities/rate-plan.entity";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  client: DeepPartial<Client>;

  @IsNotEmpty()
  user: DeepPartial<User>;

  @IsNotEmpty()
  rates: Pick<Rate, 'id'>[];

  url: string;
  active: boolean;
  code: string;
  description: string;
  priority: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  ratePlan?: DeepPartial<RatePlan>;
  estimate?: Estimate;
  mood?: Mood;
}
