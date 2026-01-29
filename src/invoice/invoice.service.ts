import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Between, DataSource, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, In, IsNull, Repository } from 'typeorm';
import { REPOSITORY } from './constants';
import { InvoiceEntry, InvoiceEntryUnit } from './entities/invoice-entry.entity';
import { CreateInvoiceEntryDto } from './dto/create-invoice-entry.dto';
import { DATA_SOURCE } from 'src/utils/constants';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { RateType } from 'src/rate/constants';
import { InvoiceEntryPreview, InvoicePreview, InvoiceTrackingGroup } from './entities/invoice-preview';


@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(REPOSITORY)
    private readonly repository: Repository<Invoice>,
  ) {}

  create(dto: CreateInvoiceDto, entryDtos: Omit<CreateInvoiceEntryDto, 'invoice' | 'unit' | 'total'>[]) {
    if (dto.type !== RateType.HOURLY) throw new NotImplementedException('Invoices of not-hourly type haven\'t been implemmented yet');
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Invoice);
      const entryRepo = manager.getRepository(InvoiceEntry);
      const created = await repo.save(repo.create(dto));
      const options: FindOptionsWhere<Tracking> = {
        user: { id: created.user.id },
        date: Between(created.startDate, created.endDate),
        ...(created?.client?.id && {
          task: { project: { client: { id: created.client.id } } },
        }),
      };
      const preview = await this.previewHourly(options, manager);
      const mergedEntries = entryDtos
        .reduce((list, item) => {
          const previewEntry = preview.entries.get(item.key);
          if (previewEntry) {
            previewEntry.name = item.name;
            list.push(previewEntry);
          }
          return list;
        }, [] as InvoiceEntryPreview[]);
      const savedEntries = await entryRepo.save(mergedEntries.map(entry => entry.getInvoiceEntry(created)));
      created.entries = savedEntries;
      created.updateTotal();
      await repo.save(created);
      const trackingRepo = manager.getRepository(Tracking);
      const trackingIds = mergedEntries.reduce((list, entry) => {
        list.push(...entry.tracking.map(t => t.id));
        return list;
      }, [] as Tracking['id'][]);
      await trackingRepo.update({ id: In(trackingIds) }, { invoice: { id: created.id } });
      return created;
    });
  }

  findAll(options: FindManyOptions<Invoice>) {
    return this.repository.find({
      relations: {
        client: true,
        project: true,
        currency: true,
      },
      ...options,
    });
  }

  count(options: FindManyOptions<Invoice>) {
    return this.repository.count(options);
  }

  findOne(options: FindOneOptions<Invoice>) {
    return this.repository
      .findOneOrFail({
        relations: {
          entries: true,
          tracking: {
            task: { project: { client: true } },
            rateVersion: { ratePlan: true },
          },
        },
        ...options,
      })
      .then(item => {
        const preview = this.buildPreviewHourly(item.tracking);
        item.entries.forEach(entry => {
          entry.tracking = preview.entries.get(entry.key)?.tracking ?? [];
        });
        item.tracking = [];
        return item;
      });
  }

  async update(options: FindOptionsWhere<Invoice>, dto: UpdateInvoiceDto) {
    await this.repository.update(options, dto);
    return this.findOne({ where: options });
  }

  remove(options: FindOptionsWhere<Invoice>) {
    return this.repository.delete(options);
  }

  async previewHourly(options: FindOptionsWhere<Tracking>, manager: EntityManager = this.dataSource.manager) {
    const repo = manager.getRepository(Tracking);
    const tracking = await repo.find({
      relations: {
        task: { project: { client: true } },
        rateVersion: { ratePlan: true },
      },
      where: {
        ...options,
        billable: true,
        invoice: IsNull(),
        rateVersion: { ratePlan: { type: RateType.HOURLY } },
      },
      order: { date: 'ASC' },
    });
    return this.buildPreviewHourly(tracking);
  }

  buildPreviewHourly(tracking: Tracking[]) {
    const preview = new InvoicePreview();
    const groupped = tracking.reduce((acc, item) => {
      const key = this.makeKey(item);
      if (!acc[key]) {
        acc[key] = {
          key,
          list: [],
          task: item.task,
          project: item.task.project,
          ratePlan: item.rateVersion.ratePlan,
          rateVersion: item.rateVersion,
        };
      }
      acc[key].list.push(item.getTrackingLight());
      return acc;
    }, {} as { [key: string]: InvoiceTrackingGroup });
    for (const group of Object.values(groupped)) {
      const entry = new InvoiceEntryPreview(group, InvoiceEntryUnit.HOUR);
      preview.entries.set(group.key, entry);
      preview.tasks.set(group.task.id, group.task);
      preview.projects.set(group.project.id, group.project);
      preview.total += entry.total;
    }
    return preview;
  }

  private makeKey(item: Tracking) {
    return 'cid:' + item.task.project.client.id + '-'
         + 'pid:' + item.task.project.id + '-'
         + 'tid:' + item.task.id + '-'
         + 'vid:' + item.rateVersion.id;
  }
}
