import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Client } from 'src/client/entities/client.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { TransactionCategory } from 'src/transaction-category/entities/transaction-category.entity';
import { User } from 'src/user/entities/user.entity';
import { unscaleMoney } from 'src/utils/money-scaler';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity()
export class Transaction extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Invoice, { nullable: true, onDelete: 'SET NULL' })
  invoice: Invoice;

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @ManyToOne(() => BankAccount, { eager: true })
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
    cascade: false,
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: TransactionCategory[];

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      bankAccount: this.bankAccount.toPlainObject(),
      date: this.date,
      amount: unscaleMoney(this.amount),
      type: this.type,
      note: this.note,
      categories: this.categories.map(c => c.toPlainObject()),
      ...(this.invoice?.id && { invoice: this.invoice.toPlainObject() }),
      ...(this.client?.id && { client: this.client.toPlainObject() }),
    };
  }
}
