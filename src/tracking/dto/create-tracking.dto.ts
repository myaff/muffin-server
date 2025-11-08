import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";

export class CreateTrackingDto {
  @IsNotEmpty()
  task: Task;

  @IsNotEmpty()
  user: User;

  @IsDateString()
  date: string;

  @IsNumber()
  hours: number;
  note: string;
  hidden: boolean;
}
