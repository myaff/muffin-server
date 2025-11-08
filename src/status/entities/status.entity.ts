import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum StatusGroup {
  TODO = 'todo',
  PROGRESS = 'progress',
  APPROVE = 'approve',
  DONE = 'done',
}

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusGroup,
    default: StatusGroup.TODO
  })
  group: StatusGroup;

  @Column()
  title: string;
}
