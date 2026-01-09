import { Bank } from 'src/bank/entities/bank.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Country } from 'src/country/entities/country.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class BankAccount extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Bank, { nullable: true })
  bank: Bank;

  @ManyToOne(() => Country)
  country: Country;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column()
  name: string;

  @Column({ type: 'bigint', default: 0 })
  startingBalance: bigint;

  @Column({ type: 'bigint', default: 0 })
  balance: bigint;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
