import { IsNotEmpty } from "class-validator";
import { Estimate } from "src/base/estimate.embed";
import { Mood } from "src/base/mood.embed";
import { Project } from "src/project/entities/project.entity";
import { Status } from "src/status/entities/status.entity";
import { User } from "src/user/entities/user.entity";

export class CreateTaskDto {
  @IsNotEmpty()
  project: Project;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  code: string;
  url: string;
  description: string;
  priority: number;
  startDate: string;
  endDate: string;
  estimate?: Estimate;
  mood?: Mood;
}
