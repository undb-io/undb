import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record.js'
import type { BoolIsFalse, BoolIsTrue } from './bool.specification.js'
import type { DateRangeEqual } from './date-range.specification.js'
import type {
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification.js'
import type {
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
} from './number.specification.js'
import type { ParentAvailableSpec } from './parent.specification.js'
import type { WithRecordAutoIncrement } from './record-auto-increment.specification.js'
import type { WithRecordCreatedAt } from './record-created-at.specification.js'
import type { WithRecordId, WithRecordIds } from './record-id.specification.js'
import type { WithRecordTableId } from './record-table-id.specification.js'
import type { WithRecordUpdatedAt } from './record-updated-at.specification.js'
import type { WithRecordValues } from './record-values.specification.js'
import type { ReferenceEqual } from './reference.specification.js'
import type { SelectEqual, SelectIn } from './select.specification.js'
import type {
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
} from './string.specification.js'
import type { IsTreeRoot, TreeAvailableSpec } from './tree.specification.js'

interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
  idsIn(s: WithRecordIds): void
  tableIdEqual(s: WithRecordTableId): void

  createdAt(s: WithRecordCreatedAt): void
  updatedAt(s: WithRecordUpdatedAt): void

  autoIncrement(s: WithRecordAutoIncrement): void

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

  dateRangeEqual(s: DateRangeEqual): void

  selectEqual(s: SelectEqual): void
  selectIn(s: SelectIn): void

  boolIsTrue(s: BoolIsTrue): void
  boolIsFalse(s: BoolIsFalse): void

  referenceEqual(s: ReferenceEqual): void

  treeAvailable(s: TreeAvailableSpec): void
  isTreeRoot(s: IsTreeRoot): void

  parentAvailable(s: ParentAvailableSpec): void
}

export type RecordCompositeSpecification = CompositeSpecification<Record, IRecordVisitor>

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor & ISpecVisitor
