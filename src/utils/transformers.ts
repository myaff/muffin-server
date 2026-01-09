import { isArray } from 'class-validator';

export function ensureArray<T = any>(value: T | T[]): T[] {
  return isArray(value) ? value : [value];
}
