import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type { NumberEqual } from './number.specification'
import type { WithRecordId } from './record-id.specifaction'
import type { WithRecordTableId } from './record-table-id.specification'
import type { StringContain, StringEqual } from './string.specification'

export interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  tableIdEqual(s: WithRecordTableId): void
}

export interface IRecordValueVisitor {
  stringEqual(s: StringEqual): void
  stringContain(s: StringContain): void

  numberEqual(s: NumberEqual): void
}

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor
