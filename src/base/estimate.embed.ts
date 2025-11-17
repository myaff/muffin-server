import { Column } from "typeorm";

export class Estimate {
  @Column({ type: 'integer', nullable: true })
  min: number;

  @Column({ type: 'integer', nullable: true })
  max: number;
}