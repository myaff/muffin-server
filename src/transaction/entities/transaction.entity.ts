import { BankAccount } from "src/bank-account/entities/bank-account.entity";
import { BaseContentEntity } from "src/base/baseContentEntity";
import { Client } from "src/client/entities/client.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

export enum TransactionType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

@Entity()
export class Transaction extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Invoice, { nullable: true })
  invoice: Invoice;

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @ManyToOne(() => BankAccount)
  bankAccount: BankAccount;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'money' })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;
}
