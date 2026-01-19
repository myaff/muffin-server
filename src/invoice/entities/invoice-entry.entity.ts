import { Column, Entity, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BaseContentEntity } from 'src/base/baseContentEntity';
import { unscaleMoney } from 'src/utils/money-scaler';

export enum InvoiceEntryUnit {
  HOUR = 'HOUR',
  PCS = 'PCS',
}

@Entity()
export class InvoiceEntry extends BaseContentEntity {
  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column({ type: 'character varying' })
  name: string;

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

  toPlainObject(): object {
    return {
      ...super.toPlainObject(),
      name: this.name,
      pricePerUnit: unscaleMoney(this.pricePerUnit),
      count: this.count,
      total: unscaleMoney(this.total),
      unit: this.unit,
      ...(this.invoice?.id && { invoice: this.invoice.toPlainObject() }),
    };
  }
}
