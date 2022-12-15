import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type {
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification'
import type {
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
} from './number.specification'
import type { WithRecordCreatedAt } from './record-created-at.specification'
import type { WithRecordId } from './record-id.specifaction'
import type { WithRecordTableId } from './record-table-id.specification'
import type { WithRecordValues } from './record-values.specification'
import type { StringContain, StringEndsWith, StringEqual, StringRegex, StringStartsWith } from './string.specification'

interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  tableIdEqual(s: WithRecordTableId): void

  createdAt(s: WithRecordCreatedAt): void

  values(s: WithRecordValues): void
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

  dateEqual(s: DateEqual): void
  dateGreaterThan(s: DateGreaterThan): void
  dateLessThan(s: DateLessThan): void
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void
  dateLessThanOrEqual(s: DateLessThanOrEqual): void
}

export type RecordCompositeSpecification = CompositeSpecification<Record, IRecordVisitor>

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor & ISpecVisitor
