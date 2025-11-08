import { IsISO4217CurrencyCode, IsNotEmpty } from "class-validator";

export class CreateCurrencyDto {
  @IsISO4217CurrencyCode()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  symbol: string;
}
