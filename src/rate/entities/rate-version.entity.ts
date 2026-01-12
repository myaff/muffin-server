import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RatePlan } from './rate-plan.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';

@Entity()
export class RateVersion extends BaseContentEntity {
  @ManyToOne(() => RatePlan)
  ratePlan: RatePlan;

  @ManyToOne(() => User)
  user: User;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ default: 1 })
  recurringCount: number;

  @Column({ default: 0 })
  includedHours: number;

  @Column({ nullable: true })
  overageHourly: number;

  @Column({ type: 'boolean', default: true })
  editable: boolean;

  @Column({ type: 'boolean', default: true })
  deletable: boolean;
}
