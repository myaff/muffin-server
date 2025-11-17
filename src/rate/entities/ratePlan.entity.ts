import { Currency } from "src/currency/entities/currency.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { RateRecurringUnit, RateScope, RateType } from "../constants";
import { Client } from "src/client/entities/client.entity";
import { BaseContentEntity } from "src/base/baseContentEntity";
import { RateVersion } from "./rateVersion.entity";

@Entity()
export class RatePlan extends BaseContentEntity {
  @ManyToOne(() => Currency)
  currency: Currency;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Client, { nullable: true })
  client: Client;

  @OneToOne(() => Project, { nullable: true })
  project: Project;

  @OneToMany(() => RateVersion, (rateVersion) => rateVersion.ratePlan)
  versions: RateVersion[];

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RateType,
    default: RateType.HOURLY,
  })
  type: RateType;

  @Column({
    type: 'enum',
    enum: RateRecurringUnit,
    nullable: true,
  })
  recurringUnit: RateRecurringUnit;

  @Column({
    type: 'enum',
    enum: RateScope,
    default: RateScope.USER,
  })
  scope: RateScope;

  @Column({ default: true })
  active: boolean;
}
