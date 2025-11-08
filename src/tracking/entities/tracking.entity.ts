import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tracking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'real' })
  hours: number;

  @Column({ default: false })
  hidden: boolean;
}
