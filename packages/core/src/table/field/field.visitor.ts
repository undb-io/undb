import type { CountField } from './fields/count/count-field.js'
import type { CreatedAtField } from './fields/created-at/created-at-field.js'
import type { CreatedByField } from './fields/created-by/created-by-field.js'
import type { DateRangeField } from './fields/date-range/date-range-field.js'
import type { DateField } from './fields/date/date-field.js'
import type { IdField } from './fields/id/id-field.js'
import type {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CurrencyField,
  EmailField,
  StringField,
} from './fields/index.js'
import type { JsonField } from './fields/json/json-field.js'
import type { LookupField } from './fields/lookup/lookup-field.js'
import type { MaxField } from './fields/max/max-field.js'
import type { MinField } from './fields/min/min-field.js'
import type { MultiSelectField } from './fields/multi-select/multi-select-field.js'
import type { NumberField } from './fields/number/number-field.js'
import type { ParentField } from './fields/parent/parent-field.js'
import type { QRCodeField } from './fields/qrcode/qrcode-field.js'
import type { RatingField } from './fields/rating/rating-field.js'
import type { ReferenceField } from './fields/reference/reference-field.js'
import type { SelectField } from './fields/select/select-field.js'
import type { SumField } from './fields/sum/sum-field.js'
import type { TreeField } from './fields/tree/tree-field.js'
import type { UpdatedAtField } from './fields/updated-at/updated-at-field.js'
import type { UpdatedByField } from './fields/updated-by/updated-by-field.js'
import type { UrlField } from './fields/url/url-field.js'

export interface IFieldVisitor {
  id(field: IdField): void
  createdAt(field: CreatedAtField): void
  createdBy(field: CreatedByField): void
  updatedAt(field: UpdatedAtField): void
  updatedBy(field: UpdatedByField): void
  attachment(field: AttachmentField): void
  autoIncrement(field: AutoIncrementField): void
  string(field: StringField): void
  email(field: EmailField): void
  qrcode(field: QRCodeField): void
  url(field: UrlField): void
  json(field: JsonField): void
  color(field: ColorField): void
  number(field: NumberField): void
  bool(field: BoolField): void
  date(field: DateField): void
  dateRange(field: DateRangeField): void
  select(field: SelectField): void
  multiSelect(field: MultiSelectField): void
  reference(field: ReferenceField): void
  tree(field: TreeField): void
  parent(field: ParentField): void
  rating(field: RatingField): void
  currency(field: CurrencyField): void
  count(field: CountField): void
  sum(field: SumField): void
  average(field: AverageField): void
  lookup(field: LookupField): void
  collaborator(field: CollaboratorField): void
  min(field: MinField): void
  max(field: MaxField): void
}
