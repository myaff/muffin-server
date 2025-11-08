import { IsIn, IsNotEmpty, ValidateIf } from "class-validator";
import { ClientType } from "../entities/client.entity";
import { User } from "src/user/entities/user.entity";
import { Orgform } from "src/orgform/entities/orgform.entity";

export class CreateClientDto {
  @IsIn(Object.values(ClientType))
  type: ClientType;

  @IsNotEmpty()
  name: string;

  @ValidateIf(o => o.type === ClientType.COMPANY)
  @IsNotEmpty()
  orgform: Orgform;

  user: User;
}
