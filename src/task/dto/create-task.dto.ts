import { IsNotEmpty } from "class-validator";
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
}
