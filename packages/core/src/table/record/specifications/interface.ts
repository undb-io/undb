import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import { type ISpecification } from '@undb/domain'
import { type Record } from '../record.js'
import type { HasExtension, HasFileType, IsAttachmentEmpty } from './attachment.specification.js'
import type { BoolIsFalse, BoolIsTrue } from './bool.specification.js'
import type { CollaboratorEqual, CollaboratorIsEmpty } from './collaborator.specification.js'
import type {
  DateRangeDateEqual,
  DateRangeDateGreaterThan,
  DateRangeDateGreaterThanOrEqual,
  DateRangeDateLessThan,
  DateRangeDateLessThanOrEqual,
  DateRangeEmpty,
  DateRangeEqual,
} from './date-range.specification.js'
import type {
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateIsTomorrow,
  DateIsYesterday,
  DateLessThan,
  DateLessThanOrEqual,
} from './date.specification.js'
import type { JsonEmpty } from './json.specification.js'
import type { MultiSelectEqual, MultiSelectIn, MultiSelectIsEmpty } from './multi-select.specification.js'
import type {
  NumberEmpty,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
} from './number.specification.js'
import type { ParentAvailableSpec } from './parent.specification.js'
import type { WithRecordAutoIncrement } from './record-auto-increment.specification.js'
import type { WithRecordCreatedAt } from './record-created-at.specification.js'
import type { CreatedByIn, WithRecordCreatedBy } from './record-created-by.specification.js'
import type { WithRecordId, WithRecordIds } from './record-id.specification.js'
import type { WithRecordLike } from './record-search.specification.js'
import type { WithRecordTableId } from './record-table-id.specification.js'
import type { WithRecordUpdatedAt } from './record-updated-at.specification.js'
import type { UdpatedByIn, WithRecordUpdatedBy } from './record-updated-by.specification.js'
import type { WithRecordValues } from './record-values.specification.js'
import type { ReferenceEqual } from './reference.specification.js'
import type { SelectEmpty, SelectEqual, SelectIn } from './select.specification.js'
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
  createdBy(s: WithRecordCreatedBy): void
  createdByIn(s: CreatedByIn): void
  updatedAt(s: WithRecordUpdatedAt): void
  updatedBy(s: WithRecordUpdatedBy): void
  updatedByIn(s: UdpatedByIn): void

  autoIncrement(s: WithRecordAutoIncrement): void

  values(s: WithRecordValues): void
}

interface IRecordValueVisitor {
  stringEqual(s: StringEqual): void
  stringContain(s: StringContain): void
  stringStartsWith(s: StringStartsWith): void
  stringEndsWith(s: StringEndsWith): void
  stringRegex(s: StringRegex): void
  stringEmpty(s: StringEqual): void

  like(s: WithRecordLike): void

  numberEqual(s: NumberEqual): void
  numberGreaterThan(s: NumberGreaterThan): void
  numberLessThan(s: NumberLessThan): void
  numberGreaterThanOrEqual(s: NumberGreaterThanOrEqual): void
  numberLessThanOrEqual(s: NumberLessThanOrEqual): void
  numberEmpty(s: NumberEmpty): void

  dateEqual(s: DateEqual): void
  dateGreaterThan(s: DateGreaterThan): void
  dateLessThan(s: DateLessThan): void
  dateGreaterThanOrEqual(s: DateGreaterThanOrEqual): void
  dateLessThanOrEqual(s: DateLessThanOrEqual): void
  dateIsToday(s: DateIsToday): void
  dateIsTomorrow(s: DateIsTomorrow): void
  dateIsYesterday(s: DateIsYesterday): void
  dateBetween(s: DateBetween): void

  dateRangeEqual(s: DateRangeEqual): void
  dateRangeEmpty(s: DateRangeEmpty): void
  dateRangeDateEqual(s: DateRangeDateEqual): void
  dateRangeDateGreaterThan(s: DateRangeDateGreaterThan): void
  dateRangeDateLessThan(s: DateRangeDateLessThan): void
  dateRangeDateGreaterThanOrEqual(s: DateRangeDateGreaterThanOrEqual): void
  dateRangeDateLessThanOrEqual(s: DateRangeDateLessThanOrEqual): void

  collaboratorEqual(s: CollaboratorEqual): void
  collaboratorIsEmpqy(s: CollaboratorIsEmpty): void

  multiSelectEqual(s: MultiSelectEqual): void
  multiSelectIn(s: MultiSelectIn): void
  multiSelectIsEmpty(s: MultiSelectIsEmpty): void

  selectEqual(s: SelectEqual): void
  selectIn(s: SelectIn): void
  selectEmpty(s: SelectEmpty): void

  boolIsTrue(s: BoolIsTrue): void
  boolIsFalse(s: BoolIsFalse): void

  referenceEqual(s: ReferenceEqual): void

  treeAvailable(s: TreeAvailableSpec): void
  isTreeRoot(s: IsTreeRoot): void

  parentAvailable(s: ParentAvailableSpec): void

  jsonEmpty(s: JsonEmpty): void

  hasFileType(s: HasFileType): void
  hasExtension(s: HasExtension): void
  isAttachmentEmpty(s: IsAttachmentEmpty): void
}

export type RecordCompositeSpecification = CompositeSpecification<Record, IRecordVisitor>

export type IRecordSpec = ISpecification<Record, IRecordVisitor>

export type IRecordVisitor = IRecordSpecVisitor & IRecordValueVisitor & ISpecVisitor
