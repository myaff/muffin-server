import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Estimate } from 'src/base/estimate.embed';
import { Mood } from 'src/base/mood.embed';
import { Client } from 'src/client/entities/client.entity';
import { RatePlan } from 'src/rate/entities/rate-plan.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Project extends BaseContentEntity {
  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToOne(() => RatePlan, { nullable: true })
  @JoinColumn()
  ratePlan: RatePlan;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'smallint', default: 3 })
  priority: number;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column(() => Estimate)
  estimate: Estimate;

  @Column(() => Mood)
  mood: Mood;
}
