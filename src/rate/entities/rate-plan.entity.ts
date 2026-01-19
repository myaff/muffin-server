import { Currency } from 'src/currency/entities/currency.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { RateRecurringUnit, RateScope, RateType } from '../constants';
import { Client } from 'src/client/entities/client.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { RateVersion } from './rate-version.entity';

@Entity()
export class RatePlan extends BaseContentEntity {
  @ManyToOne(() => Currency)
  currency: Pick<Currency, 'id'>;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Client, { nullable: true })
  @JoinColumn()
  client: Client;

  @OneToOne(() => Project, { nullable: true })
  @JoinColumn()
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

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      currency: this.currency,
      name: this.name,
      type: this.type,
      recurringUnit: this.recurringUnit,
      scope: this.scope,
      active: this.active,
      ...(this.versions?.length && { versions: this.versions.map(v => v.toPlainObject()) }),
      ...(this.client?.id && { client: this.client.toPlainObject() }),
      ...(this.project?.id && { project: this.project.toPlainObject() }),
    };
  }
}

export type RatePlanLight = Omit<RatePlan, 'client' | 'project' | 'versions' | 'toPlainObject'> & {
  client: Pick<Client, 'id'>;
  project: Pick<Project, 'id'>;
}
