import { Column } from "typeorm";

export class Mood {
  @Column({ nullable: true })
  valence: number;

  @Column({ nullable: true })
  arousal: number;
}