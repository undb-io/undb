import type { AttachmentFieldValue } from './fields/attachment/attachment-field-value.js'
import type { AutoIncrementFieldValue } from './fields/auto-increment/auto-increment-field-value.js'
import type { AverageFieldValue } from './fields/average/average-field-value.js'
import type { BoolFieldValue } from './fields/bool/bool-field-value.js'
import type { CollaboratorFieldValue } from './fields/collaborator/collaborator-field-value.js'
import type { ColorFieldValue } from './fields/color/color-field-value.js'
import type { CountFieldValue } from './fields/count/count-field-value.js'
import type { CreatedAtFieldValue } from './fields/created-at/created-at-field-value.js'
import type { CreatedByFieldValue } from './fields/created-by/created-by-field-value.js'
import type { CurrencyFieldValue } from './fields/currency/currency-field-value.js'
import type { DateRangeFieldValue } from './fields/date-range/date-range-field-value.js'
import type { DateFieldValue } from './fields/date/date-field-value.js'
import type { EmailFieldValue } from './fields/email/email-field-value.js'
import type { IdFieldValue } from './fields/id/id-field-value.js'
import type { JsonFieldValue } from './fields/json/json-field-value.js'
import type { LookupFieldValue } from './fields/lookup/lookup-field-value.js'
import type { MaxFieldValue } from './fields/max/max-field-value.js'
import type { MinFieldValue } from './fields/min/min-field-value.js'
import type { MultiSelectFieldValue } from './fields/multi-select/multi-select-field-value.js'
import type { NumberFieldValue } from './fields/number/number-field-value.js'
import type { ParentFieldValue } from './fields/parent/parent-field-value.js'
import type { QRCodeFieldValue } from './fields/qrcode/qrcode-field-value.js'
import type { RatingFieldValue } from './fields/rating/rating-field-value.js'
import type { ReferenceFieldValue } from './fields/reference/reference-field-value.js'
import type { SelectFieldValue } from './fields/select/select-field-value.js'
import type { StringFieldValue } from './fields/string/string-field-value.js'
import type { SumFieldValue } from './fields/sum/sum-field-value.js'
import type { TreeFieldValue } from './fields/tree/tree-field-value.js'
import type { UpdatedAtFieldValue } from './fields/updated-at/updated-at-field-value.js'
import type { UpdatedByFieldValue } from './fields/updated-by/updated-by-field-value.js'
import type { UrlFieldValue } from './fields/url/url-field-value.js'

export interface IFieldValueVisitor {
  id(value: IdFieldValue): void
  createdAt(value: CreatedAtFieldValue): void
  createdBy(value: CreatedByFieldValue): void
  updatedAt(value: UpdatedAtFieldValue): void
  updatedBy(value: UpdatedByFieldValue): void
  attachment(value: AttachmentFieldValue): void
  autoIncrement(value: AutoIncrementFieldValue): void
  string(value: StringFieldValue): void
  email(value: EmailFieldValue): void
  qrcode(value: QRCodeFieldValue): void
  url(value: UrlFieldValue): void
  json(value: JsonFieldValue): void
  color(value: ColorFieldValue): void
  number(value: NumberFieldValue): void
  bool(value: BoolFieldValue): void
  date(value: DateFieldValue): void
  dateRange(value: DateRangeFieldValue): void
  select(value: SelectFieldValue): void
  multiSelect(value: MultiSelectFieldValue): void
  reference(value: ReferenceFieldValue): void
  tree(value: TreeFieldValue): void
  parent(value: ParentFieldValue): void
  rating(value: RatingFieldValue): void
  currency(value: CurrencyFieldValue): void
  count(value: CountFieldValue): void
  sum(value: SumFieldValue): void
  average(value: AverageFieldValue): void
  lookup(value: LookupFieldValue): void
  collaborator(value: CollaboratorFieldValue): void
  min(value: MinFieldValue): void
  max(value: MaxFieldValue): void
}
