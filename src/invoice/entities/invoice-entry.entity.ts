import { Column, Entity, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { unscaleMoney } from 'src/utils/money-scaler';
import { TrackingLight } from 'src/tracking/entities/tracking.entity';

export enum InvoiceEntryUnit {
  HOUR = 'HOUR',
  PCS = 'PCS',
}

@Entity()
export class InvoiceEntry extends BaseContentEntity {
  @ManyToOne(() => Invoice, { onDelete: 'CASCADE' })
  invoice: Invoice;

  @Column({ type: 'character varying' })
  name: string;

  @Column({ type: 'character varying' })
  originalName: string;

  @Column({ type: 'bigint' })
  pricePerUnit: bigint;

  @Column({ type: 'real' })
  count: number;

  @Column({ type: 'bigint' })
  total: bigint;

  @Column({
    type: 'enum',
    enum: InvoiceEntryUnit,
  })
  unit: InvoiceEntryUnit;

  @Column()
  key: string;

  tracking?: TrackingLight[];

  toPlainObject(): object {
    if (this.invoice) this.invoice.entries = [];
    return {
      ...super.toPlainObject(),
      name: this.name,
      originalName: this.originalName,
      pricePerUnit: unscaleMoney(this.pricePerUnit),
      count: this.count,
      key: this.key,
      total: unscaleMoney(this.total),
      unit: this.unit,
      ...(this.invoice?.id && { invoice: this.invoice.toPlainObject() }),
      ...(this.tracking?.length && { tracking: this.tracking }),
    };
  }
}
