import { Project } from 'src/project/entities/project.entity';
import { RatePlan } from 'src/rate/entities/rate-plan.entity';
import { RateVersion } from 'src/rate/entities/rate-version.entity';
import { Task } from 'src/task/entities/task.entity';
import { TrackingLight } from 'src/tracking/entities/tracking.entity';
import { InvoiceEntry, InvoiceEntryUnit } from './invoice-entry.entity';
import { unscaleMoney } from 'src/utils/money-scaler';
import { CreateInvoiceEntryDto } from '../dto/create-invoice-entry.dto';
import { Invoice } from './invoice.entity';

export interface InvoiceTrackingGroup {
  key: string;
  list: TrackingLight[];
  task: Task;
  project: Project;
  rateVersion: RateVersion;
  ratePlan: RatePlan;
}
export class InvoiceEntryPreview {
  key: string;
  name: string;
  count: number;
  countMinor: number;
  countMult: number;
  pricePerUnit: bigint;
  unit: InvoiceEntryUnit;
  total: bigint;
  tracking: TrackingLight[];

  constructor(data: InvoiceTrackingGroup, unit: InvoiceEntryUnit) {
    this.key = data.key;
    this.name = `${data.task.code} ${data.task.title}`;
    this.unit = unit;
    this.countMult = this.unit === InvoiceEntryUnit.HOUR ? 60 : 1;
    this.count = data.list.reduce((sum, item) => sum + item.amount, 0);
    this.tracking = data.list;
    this.countMinor = Math.round(this.count * this.countMult);
    this.pricePerUnit = BigInt(data.rateVersion.amount);
    this.total = this.pricePerUnit * BigInt(this.countMinor) / BigInt(this.countMult);
  }

  toPlainObject(): object {
    return {
      key: this.key,
      name: this.name,
      count: this.count,
      pricePerUnit: unscaleMoney(this.pricePerUnit),
      unit: this.unit,
      total: unscaleMoney(this.total),
      tracking: this.tracking,
    };
  }

  getInvoiceEntry(invoice: Invoice): InvoiceEntry {
    const entry = new InvoiceEntry();
    entry.name = this.name;
    entry.count = this.count;
    entry.pricePerUnit = this.pricePerUnit;
    entry.total = this.total;
    entry.unit = this.unit;
    entry.invoice = invoice;
    return entry;
  }
}

export type CreateInvoiceEntryPreview = Pick<CreateInvoiceEntryDto, 'name' | 'key'> & {
  count: number;
  pricePerUnit: bigint;
  unit: InvoiceEntryUnit;
  total: bigint;
  tracking: TrackingLight[];
};

export class InvoicePreview {
  entries: Map<InvoiceEntryPreview['key'], InvoiceEntryPreview>;
  projects: Map<Project['id'], Project>;
  tasks: Map<Task['id'], Omit<Task, 'project'> & { project: Pick<Project, 'id'> }>;
  total: bigint;

  constructor() {
    this.entries = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.total = 0n;
  }

  toPlainObject(): object {
    return {
      entries: Array.from(this.entries.values()).map(entry => entry.toPlainObject()),
      tasks: Array.from(this.tasks.values()),
      projects: Array.from(this.projects.values()),
      total: unscaleMoney(this.total),
    };
  }
}
