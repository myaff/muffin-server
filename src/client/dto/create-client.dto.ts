import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entities/user.entity";
import type { DeepPartial } from "typeorm";
import { Country } from "src/country/entities/country.entity";
import { RatePlan } from "src/rate/entities/ratePlan.entity";
import { Mood } from "src/base/mood.embed";

export class CreateClientDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user: DeepPartial<User>;

  @IsNotEmpty()
  country: DeepPartial<Country>;

  ratePlan: DeepPartial<RatePlan>;
  fullName?: string;
  region?: string;
  city?: string;
  streetAddress?: string;
  zipCode?: number;
  taxId?: string;
  website?: string;
  phone?: string;
  email?: string;
  mood?: Mood;
  active: boolean;
}
