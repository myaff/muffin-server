import { isDateString } from 'class-validator';
import { Between, MoreThanOrEqual, LessThanOrEqual, FindManyOptions } from 'typeorm';

export type ParamType = string | number | boolean;
export interface QueryObject {
  [key: string]: ParamType | ParamType[],
}
export interface Paginatable {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PaginationParams = Required<Pick<FindManyOptions, 'skip' | 'take'>>;

export class BaseController {
  page = 1;
  pageSize = 10;

  getDatesFilterOptions(query: QueryObject) {
    if (!query?.dateFrom && !query?.dateTo) return null;
    const dates = {
      from: isDateString(query.dateFrom) ? query.dateFrom as string : '',
      to: isDateString(query.dateTo) ? query.dateTo as string : '',
    };
    if (dates.from && dates.to) {
      return Between(dates.from, dates.to);
    } else if (dates.from) {
      return MoreThanOrEqual(dates.from);
    } else if (dates.to) {
      return LessThanOrEqual(dates.to);
    }
    return null;
  }

  getPaginationOptions(query: QueryObject): PaginationParams {
    const qPage = query?.page ? Number(query.page) : this.page;
    const qPageSize = query?.pageSize ? Number(query.pageSize) : this.pageSize;
    return {
      skip: (qPage - 1) * qPageSize,
      take: qPageSize,
    };
  }

  getPaginationDto(params: PaginationParams, count: number): Paginatable {
    const pagesCount = Math.ceil(count / params.take);
    const page = Math.max(Math.min(Math.floor(params.skip / params.take), pagesCount), 0) + 1;
    return {
      page,
      pageSize: params.take,
      pagesCount,
      totalCount: count,
      hasNext: page < pagesCount,
      hasPrev: page > 1,
    };
  }
}
