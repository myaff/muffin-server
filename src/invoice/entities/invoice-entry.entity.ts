import { Tracking } from "src/tracking/entities/tracking.entity";
import { AfterInsert, AfterUpdate, Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { Invoice } from "./invoice.entity";
import { BaseContentEntity } from "src/base/baseContentEntity";

@Entity()
export class InvoiceEntry extends BaseContentEntity {
  @OneToOne(() => Tracking, { nullable: true })
  tracking: Tracking;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column({ type: 'money' })
  pricePerUnit: number;

  @Column()
  count: number;

  @Column({ type: 'money' })
  total: number;

  @AfterInsert()
  @AfterUpdate()
  updateTotal() {
    this.total = this.pricePerUnit * this.count;
  }
}