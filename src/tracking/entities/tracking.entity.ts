import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Mood } from 'src/base/mood.embed';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Project } from 'src/project/entities/project.entity';
import { RatePlan } from 'src/rate/entities/rate-plan.entity';
import { RateVersion } from 'src/rate/entities/rate-version.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Tracking extends BaseContentEntity {
  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => RateVersion)
  rateVersion: RateVersion;

  @ManyToOne(() => Invoice, { nullable: true, onDelete: 'SET NULL' })
  invoice: Invoice | null;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'real' })
  amount: number;

  @Column({ default: true })
  billable: boolean;

  @Column(() => Mood)
  mood: Mood;

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      date: this.date,
      note: this.note,
      amount: this.amount,
      billable: this.billable,
      mood: this.mood,
      task: this.task.toPlainObject(),
      rateVersion: this.rateVersion.toPlainObject(),
      ...(this.invoice && { invoice: this.invoice.toPlainObject() }),
    };
  }

  getTrackingLight(): TrackingLight {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      date: this.date,
      note: this.note,
      amount: this.amount,
      billable: this.billable,
      mood: this.mood,
      task: { id: this.task.id },
      project: { id: this.task.project.id },
      ratePlan: { id: this.rateVersion.ratePlan.id },
      rateVersion: { id: this.rateVersion.id },
    };
  }
}

export type TrackingLight = Omit<Tracking, 'task' | 'rateVersion' | 'toPlainObject' | 'user' | 'getTrackingLight' | 'invoice'> & {
  task: Pick<Task, 'id'>;
  project: Pick<Project, 'id'>;
  rateVersion: Pick<RateVersion, 'id'>;
  ratePlan: Pick<RatePlan, 'id'>;
}
