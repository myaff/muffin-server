import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class TransactionCategory extends BaseContentEntity {
  @Column({ type: 'character varying' })
  name: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'boolean' })
  income: boolean;

  @Column({ type: 'boolean' })
  expense: boolean;

  @ManyToMany(() => Transaction, (transaction) => transaction.categories, {
    nullable: true,
  })
  transactions: Transaction[];

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      name: this.name,
      income: this.income,
      expense: this.expense,
      transactions: this.transactions.map(t => t.toPlainObject()),
    };
  }
}
