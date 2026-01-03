import { BaseContentEntity } from "src/base/baseContentEntity";
import { Country } from "src/country/entities/country.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { RatePlan } from "src/rate/entities/ratePlan.entity";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class User extends BaseContentEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  audience: number;

  @Column()
  lang: string;

  @ManyToOne(() => Currency)
  currency: Currency;

  @ManyToOne(() => Country)
  country: Country;

  @OneToMany(() => RatePlan, (ratePlan) => ratePlan.user)
  ratePlans: RatePlan[];
}