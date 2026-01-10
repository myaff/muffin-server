import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Client } from 'src/client/entities/client.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { TransactionCategory } from 'src/transaction-category/entities/transaction-category.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
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

  @Column({ type: 'bigint' })
  amount: bigint;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToMany(() => TransactionCategory, (category) => category.transactions, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinTable()
  categories: TransactionCategory[];
}
