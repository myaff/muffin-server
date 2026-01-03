import { IsNotEmpty, Length } from "class-validator";
import { Country } from "src/country/entities/country.entity";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";

export class CreateBankDto {
  user: DeepPartial<User>;

  @IsNotEmpty()
  country: DeepPartial<Country>;

  @Length(11, 11)
  swift: string;

  @IsNotEmpty()
  name: string;
  fullName: string;
  bic: number;
}
