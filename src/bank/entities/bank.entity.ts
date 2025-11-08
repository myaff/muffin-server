import { Orgform } from "src/orgform/entities/orgform.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Bank {
  @PrimaryColumn({ type: 'character varying', length: 11 })
  swift: string;
  
  @Column()
  name: string;

  @ManyToOne(() => Orgform)
  orgform: Orgform;

  @Column()
  bic: number;
}
