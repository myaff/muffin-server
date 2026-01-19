import { Currency } from 'src/currency/entities/currency.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Country {
  @Column({ unique: true, primary: true })
  iso2: string;

  @Column({ unique: true })
  iso3: string;

  @Column()
  name: string;

  @Column({ type: 'integer', nullable: true })
  numericCode: number;

  @Column({ nullable: true })
  phoneCode: string;

  @Column({ nullable: true })
  capital: string;

  @Column({ nullable: true })
  nameNative: string;

  @Column({ nullable: true })
  nameRu: string;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column({ type: 'real', nullable: true })
  latitude: number;

  @Column({ type: 'real', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  tld: string;

  @Column()
  emoji: string;

  @Column()
  emojiu: string;
}
