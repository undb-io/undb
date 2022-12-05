import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type { WithRecordId } from './record-id.specifaction'
import type { WithRecordTableId } from './record-table-id.specification'
import type { StringEqual } from './string.specification'

export interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  tableIdEqual(s: WithRecordTableId): void

  valueStringEqual(s: StringEqual): void
}

export type IRecordSpec = ISpecification<Record, IRecordSpecVisitor>
