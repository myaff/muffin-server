import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RatePlan } from './rate-plan.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { unscaleMoney } from 'src/utils/money-scaler';

@Entity()
export class RateVersion extends BaseContentEntity {
  @ManyToOne(() => RatePlan)
  ratePlan: RatePlan;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'bigint' })
  amount: bigint;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ default: 1 })
  recurringCount: number;

  @Column({ default: 0 })
  includedHours: number;

  @Column({ type: 'bigint', nullable: true })
  overageHourly: bigint;

  @Column({ type: 'boolean', default: true })
  editable: boolean;

  @Column({ type: 'boolean', default: true })
  deletable: boolean;

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      startDate: this.startDate,
      endDate: this.endDate,
      recurringCount: this.recurringCount,
      amount: unscaleMoney(this.amount),
      includedHours: this.includedHours,
      overageHourly: this.overageHourly
        ? unscaleMoney(this.overageHourly)
        : null,
      editable: this.editable,
      deletable: this.deletable,
      ...(this.ratePlan?.id && { ratePlan: this.ratePlan.toPlainObject() }),
    };
  }
}

export type RateVersionLight = Omit<RateVersion, 'ratePlan' | 'toPlainObject'> & {
  ratePlan: Pick<RatePlan, 'id'>;
}
