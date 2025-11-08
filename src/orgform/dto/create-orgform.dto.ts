import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrgformDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  name: string;
}
