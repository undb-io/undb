import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type { BoolIsFalse, BoolIsTrue } from './bool.specification'
import type { DateRangeEqual } from './date-range.specification'
import type {
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification'
import type { NullSpecification } from './null.specification'
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
import type { WithRecordUpdatedAt } from './record-updated-at.specification'
import type { WithRecordValues } from './record-values.specification'
import type { ReferenceEqual } from './reference.specification'
import type { SelectEqual, SelectIn } from './select.specification'
import type { StringContain, StringEndsWith, StringEqual, StringRegex, StringStartsWith } from './string.specification'

interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  tableIdEqual(s: WithRecordTableId): void

  createdAt(s: WithRecordCreatedAt): void
  updatedAt(s: WithRecordUpdatedAt): void

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
  dateIsToday(s: DateIsToday): void

  null(s: NullSpecification): void
  dateRangeEqual(s: DateRangeEqual): void

  selectEqual(s: SelectEqual): void
  selectIn(s: SelectIn): void

  boolIsTrue(s: BoolIsTrue): void
  boolIsFalse(s: BoolIsFalse): void

  referenceEqual(s: ReferenceEqual): void
}

export type RecordCompositeSpecification = CompositeSpecification<Record, IRecordVisitor>

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor & ISpecVisitor
