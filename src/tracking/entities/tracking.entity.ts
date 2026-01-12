import { BaseContentEntity } from "src/base/baseContentEntity";
import { Mood } from "src/base/mood.embed";
import { RateVersion } from "src/rate/entities/rate-version.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Tracking extends BaseContentEntity {
  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => RateVersion)
  rateVersion: RateVersion;

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
}
