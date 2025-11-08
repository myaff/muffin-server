import { IsIn, IsNotEmpty } from "class-validator";
import { StatusGroup } from "../entities/status.entity";

export class CreateStatusDto {
  @IsIn(Object.values(StatusGroup))
  group: StatusGroup;

  @IsNotEmpty()
  title: string;
}
