import { User } from 'src/user/entities/user.entity';
import type { DeepPartial } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionCategoryDto {
  user: DeepPartial<User>;

  @IsNotEmpty()
  name: string;

  income: boolean;
  expense: boolean;
}
