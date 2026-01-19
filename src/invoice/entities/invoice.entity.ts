import { BaseContentEntity } from 'src/base/baseContentEntity';
import { Client } from 'src/client/entities/client.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { Project } from 'src/project/entities/project.entity';
import { RateType } from 'src/rate/constants';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { User } from 'src/user/entities/user.entity';
import { unscaleMoney } from 'src/utils/money-scaler';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { InvoiceEntry } from './invoice-entry.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PARTLY_PAID = 'partly-paid',
  PAID = 'paid',
}

@Entity()
export class Invoice extends BaseContentEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'date' })
  issuedDate: string;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({ type: 'date', nullable: true })
  paidDate: string;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column({ type: 'bigint', default: 0n })
  total: bigint;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({
    type: 'enum',
    enum: RateType,
  })
  type: RateType;

  @OneToMany(() => Tracking, tracking => tracking.invoice)
  tracking: Tracking[];

  @OneToMany(() => InvoiceEntry, entry => entry.invoice)
  entries: InvoiceEntry[];

  updateTotal() {
    this.total = this.entries.reduce((sum, entry) => sum + entry.total, 0n);
  }

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      startDate: this.startDate,
      endDate: this.endDate,
      issuedDate: this.issuedDate,
      dueDate: this.dueDate,
      paidDate: this.paidDate,
      currency: this.currency,
      total: unscaleMoney(this.total),
      type: this.type,
      status: this.status,
      ...(this.client?.id && { client: this.client.toPlainObject() }),
      ...(this.project?.id && { project: this.project.toPlainObject() }),
      ...(this.tracking?.length && { tracking: this.tracking.map(t => t.toPlainObject()) }),
      ...(this.entries?.length && { entries: this.entries.map(e => e.toPlainObject()) }),
    };
  }
}
