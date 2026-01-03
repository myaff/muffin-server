import { BaseContentEntity } from "src/base/baseContentEntity";
import { Country } from "src/country/entities/country.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Bank extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'character varying', length: 11 })
  swift: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  fullName: string;

  @ManyToOne(() => Country)
  country: Country;

  @Column()
  bic: number;
}
