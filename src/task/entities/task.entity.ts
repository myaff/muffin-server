import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Estimate } from 'src/base/estimate.embed';
import { Mood } from 'src/base/mood.embed';
import { Project } from 'src/project/entities/project.entity';
import { RatePlan } from 'src/rate/entities/rate-plan.entity';
import { Status } from 'src/status/entities/status.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Task extends BaseContentEntity {
  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Status)
  status: Status;

  @Column()
  title: string;

  @Column()
  code: string;

  @OneToMany(() => Tracking, tracking => tracking.task)
  tracking: Tracking[];

  @Column()
  url: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  ratePlan?: RatePlan;

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      title: this.title,
      code: this.code,
      url: this.url,
      active: this.active,
      description: this.description,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      estimate: this.estimate,
      mood: this.mood,
      status: this.status,
      ...(this.project?.id && { project: this.project.toPlainObject() }),
      ...(this.tracking?.length && { tracking: this.tracking.map(t => t.toPlainObject()) }),
      ...(this.ratePlan?.id && { ratePlan: this.ratePlan.toPlainObject() }),
    };
  }
}

export type TaskLight = Omit<Task, 'project' | 'tracking' | 'toPlainObject'> & {
  project: Pick<Project, 'id'>;
}
