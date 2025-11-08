import { Client } from "src/client/entities/client.entity";
import { Rate } from "src/rate/entities/rate.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Rate, (rate) => rate.projects, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  rates: Rate[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @Column()
  title: string;

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;
}
