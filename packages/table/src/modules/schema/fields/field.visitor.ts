import type { UrlField } from "."
import type { AttachmentField } from "./variants/attachment-field"
import type { AutoIncrementField } from "./variants/autoincrement-field"
import type { CheckboxField } from "./variants/checkbox-field"
import type { CreatedAtField } from "./variants/created-at-field"
import type { CreatedByField } from "./variants/created-by-field"
import type { CurrencyField } from "./variants/currency-field"
import type { DateField } from "./variants/date-field"
import type { EmailField } from "./variants/email-field"
import type { IdField } from "./variants/id-field/id-field.vo"
import type { JsonField } from "./variants/json-field"
import type { LongTextField } from "./variants/long-text-field"
import type { NumberField } from "./variants/number-field/number-field.vo"
import type { RatingField } from "./variants/rating-field"
import type { ReferenceField } from "./variants/reference-field/reference-field.vo"
import type { RollupField } from "./variants/rollup-field"
import type { SelectField } from "./variants/select-field"
import type { StringField } from "./variants/string-field/string-field.vo"
import type { UpdatedAtField } from "./variants/updated-at-field/updated-at-field.vo"
import type { UpdatedByField } from "./variants/updated-by-field/updated-by-field.vo"
import type { UserField } from "./variants/user-field"

export interface IFieldVisitor {
  id(field: IdField): void
  autoIncrement(field: AutoIncrementField): void
  longText(field: LongTextField): void
  createdAt(field: CreatedAtField): void
  createdBy(field: CreatedByField): void
  updatedAt(field: UpdatedAtField): void
  updatedBy(field: UpdatedByField): void
  string(field: StringField): void
  number(field: NumberField): void
  rating(field: RatingField): void
  select(field: SelectField): void
  email(field: EmailField): void
  attachment(field: AttachmentField): void
  date(field: DateField): void
  json(field: JsonField): void
  checkbox(field: CheckboxField): void
  user(field: UserField): void
  url(field: UrlField): void
  currency(field: CurrencyField): void

  reference(field: ReferenceField): void
  rollup(field: RollupField): void
}
