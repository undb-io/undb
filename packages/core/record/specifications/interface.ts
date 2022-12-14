import type { ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type {
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
} from './number.specification'
import type { WithRecordId } from './record-id.specifaction'
import type { WithRecordTableId } from './record-table-id.specification'
import type { StringContain, StringEndsWith, StringEqual, StringRegex, StringStartsWith } from './string.specification'

interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  tableIdEqual(s: WithRecordTableId): void
}

interface IRecordValueVisitor {
  stringEqual(s: StringEqual): void
  stringContain(s: StringContain): void
  stringStartsWith(s: StringStartsWith): void
  stringEndsWith(s: StringEndsWith): void
  stringRegex(s: StringRegex): void

  numberEqual(s: NumberEqual): void
  numberGreaterThan(s: NumberGreaterThan): void
  numberLessThan(s: NumberLessThan): void
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void
}

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor & ISpecVisitor
