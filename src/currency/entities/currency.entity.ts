import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryColumn({ type: 'character varying', length: 3 })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'character varying', length: 8 })
  symbol: string;
}
