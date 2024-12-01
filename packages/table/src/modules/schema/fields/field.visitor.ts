import type { AttachmentField } from "./variants/attachment-field"
import type { AutoIncrementField } from "./variants/autoincrement-field"
import type { ButtonField } from "./variants/button-field/button-field.vo"
import type { CheckboxField } from "./variants/checkbox-field"
import type { CreatedAtField } from "./variants/created-at-field"
import type { CreatedByField } from "./variants/created-by-field"
import type { CurrencyField } from "./variants/currency-field"
import type { DateField } from "./variants/date-field"
import type { DateRangeField } from "./variants/date-range-field/date-range-field.vo"
import type { DurationField } from "./variants/duration-field/duration-field.vo"
import type { EmailField } from "./variants/email-field"
import type { FormulaField } from "./variants/formula-field/formula-field.vo"
import type { IdField } from "./variants/id-field/id-field.vo"
import type { JsonField } from "./variants/json-field"
import type { LongTextField } from "./variants/long-text-field"
import type { NumberField } from "./variants/number-field/number-field.vo"
import type { PercentageField } from "./variants/percentage-field/percentage-field.vo"
import type { RatingField } from "./variants/rating-field"
import type { ReferenceField } from "./variants/reference-field/reference-field.vo"
import type { RollupField } from "./variants/rollup-field"
import type { SelectField } from "./variants/select-field"
import type { StringField } from "./variants/string-field/string-field.vo"
import type { UpdatedAtField } from "./variants/updated-at-field/updated-at-field.vo"
import type { UpdatedByField } from "./variants/updated-by-field/updated-by-field.vo"
import type { UrlField } from "./variants/url-field/url-field.vo"
import type { UserField } from "./variants/user-field"

export interface IFieldVisitor<T = void> {
  id(field: IdField): T
  autoIncrement(field: AutoIncrementField): T
  longText(field: LongTextField): T
  createdAt(field: CreatedAtField): T
  createdBy(field: CreatedByField): T
  updatedAt(field: UpdatedAtField): T
  updatedBy(field: UpdatedByField): T
  string(field: StringField): T
  number(field: NumberField): T
  rating(field: RatingField): T
  select(field: SelectField): T
  email(field: EmailField): T
  attachment(field: AttachmentField): T
  date(field: DateField): T
  dateRange(field: DateRangeField): T
  json(field: JsonField): T
  checkbox(field: CheckboxField): T
  user(field: UserField): T
  url(field: UrlField): T
  currency(field: CurrencyField): T
  button(field: ButtonField): T
  duration(field: DurationField): T
  percentage(field: PercentageField): T
  formula(field: FormulaField): T
  reference(field: ReferenceField): T
  rollup(field: RollupField): T
}
