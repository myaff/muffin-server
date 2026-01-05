import { BaseContentEntity } from "src/base/baseContentEntity";
import { Country } from "src/country/entities/country.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Bank extends BaseContentEntity {

  @PrimaryColumn({ unique: true })
  @Column({ type: 'character varying', length: 11 })
  bic11: string;

  @Column({ type: 'character varying', length: 8 })
  bic8: string;

  @Column({ type: 'character varying', length: 3 })
  branchCode: string;

  @Column()
  name: string;

  @ManyToOne(() => Country)
  country: Country;

  @Column({ type: 'date' })
  recordCreationDate: string;

  @Column({ type: 'date' })
  lastUpdateDate: string;

  @Column({ nullable: true })
  registeredAddress: string;

  @Column({ nullable: true })
  operationalAddress: string;

  @Column({ nullable: true })
  branchDescription: string;

  @Column({ nullable: true })
  branchAddress: string;

  @Column()
  instType: string;
}
