import { Bank } from "src/bank/entities/bank.entity";
import { BaseContentEntity } from "src/base/baseContentEntity";
import { Currency } from "src/currency/entities/currency.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class BankAccount extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Bank)
  bank: Bank;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column()
  name: string;

  @Column({ type: 'money', default: 0 })
  startingBalance: number;
}
