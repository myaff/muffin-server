import { IsNotEmpty } from "class-validator";
import { Client } from "src/client/entities/client.entity";
import { Rate } from "src/rate/entities/rate.entity";
import { User } from "src/user/entities/user.entity";

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  client: Client;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  rates: Pick<Rate, 'id'>[];

  url: string;
  active: boolean;
}
