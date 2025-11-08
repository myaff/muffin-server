import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Orgform {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortName: string;
}
