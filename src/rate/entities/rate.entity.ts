import { Currency } from "src/currency/entities/currency.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum RateType {
  HOURLY = 'hourly',
  MONTHLY = 'monthly',
  FIXED = 'fixed',
}
@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency)
  currency: Currency;

  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Project, (project) => project.rates)
  projects: Project[];

  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: RateType,
    default: RateType.HOURLY
  })
  type: RateType;

  @Column({ type: 'date' })
  dateFrom: string;

  @Column({ type: 'date', nullable: true })
  dateTo: string;
}
