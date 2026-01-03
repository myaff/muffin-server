import { BaseContentEntity } from "src/base/baseContentEntity";
import { Client } from "src/client/entities/client.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
}

@Entity()
export class Invoice extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'date' })
  issuedDate: string;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({ type: 'date' })
  paidDate: string;

  @ManyToOne(() => Currency)
  currentcy: Currency;

  @Column({ type: 'money' })
  total: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;
}
