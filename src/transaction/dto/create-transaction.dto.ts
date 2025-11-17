import { BankAccount } from "src/bank-account/entities/bank-account.entity";
import { Client } from "src/client/entities/client.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";
import { User } from "src/user/entities/user.entity";
import { DeepPartial } from "typeorm";
import { TransactionType } from "../entities/transaction.entity";
import { IsDateString, IsIn, IsNotEmpty, IsPositive } from "class-validator";

export class CreateTransactionDto {
    user: DeepPartial<User>;
    invoice: DeepPartial<Invoice> | null;
    client: DeepPartial<Client> | null;

    @IsNotEmpty()
    bankAccount: DeepPartial<BankAccount>;

    @IsDateString()
    date: string;

    @IsPositive()
    amount: number;

    @IsIn(Object.values(TransactionType))
    type: TransactionType;
}
