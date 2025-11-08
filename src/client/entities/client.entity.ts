import { Orgform } from "src/orgform/entities/orgform.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ClientType {
  PERSON = 'person',
  COMPANY = 'company',
}

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Orgform, { nullable: true })
  orgform: Orgform;

  @Column({
    type: 'enum',
    enum: ClientType,
  })
  type: ClientType;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;
}
