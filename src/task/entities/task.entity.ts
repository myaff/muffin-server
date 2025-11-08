import { Project } from "src/project/entities/project.entity";
import { Status } from "src/status/entities/status.entity";
import { Tracking } from "src/tracking/entities/tracking.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

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
}
