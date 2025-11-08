import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Currency } from "src/currency/entities/currency.entity";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  lang: string;

  @IsNotEmpty()
  currency: Currency;

  middleName: string;
  audience: number;
}