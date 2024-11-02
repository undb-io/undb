import type { ReturnType } from "@undb/formula"
import type { AttachmentField, CreatedAtField } from "../.."
import type { IFieldVisitor } from "../../field.visitor"
import type { AutoIncrementField } from "../autoincrement-field"
import type { ButtonField } from "../button-field"
import type { CheckboxField } from "../checkbox-field"
import type { CreatedByField } from "../created-by-field"
import type { CurrencyField } from "../currency-field"
import type { DateField } from "../date-field"
import type { DateRangeField } from "../date-range-field/date-range-field.vo"
import type { DurationField } from "../duration-field"
import type { EmailField } from "../email-field"
import type { IdField } from "../id-field"
import type { JsonField } from "../json-field"
import type { LongTextField } from "../long-text-field"
import type { NumberField } from "../number-field"
import type { PercentageField } from "../percentage-field"
import type { RatingField } from "../rating-field"
import type { ReferenceField } from "../reference-field"
import type { RollupField } from "../rollup-field"
import type { SelectField } from "../select-field"
import type { StringField } from "../string-field"
import type { UpdatedAtField } from "../updated-at-field"
import type { UpdatedByField } from "../updated-by-field"
import type { UrlField } from "../url-field"
import type { UserField } from "../user-field"
import type { FormulaField } from "./formula-field.vo"

export class FormulaReturnTypeVisitor implements IFieldVisitor {
  #reaturnType: ReturnType = "any"

  get returnType() {
    return this.#reaturnType
  }

  id(field: IdField): void {
    this.#reaturnType = "string"
  }
  autoIncrement(field: AutoIncrementField): void {
    this.#reaturnType = "number"
  }
  longText(field: LongTextField): void {
    this.#reaturnType = "string"
  }
  createdAt(field: CreatedAtField): void {
    this.#reaturnType = "date"
  }
  createdBy(field: CreatedByField): void {
    this.#reaturnType = "string"
  }
  updatedAt(field: UpdatedAtField): void {
    this.#reaturnType = "date"
  }
  updatedBy(field: UpdatedByField): void {
    this.#reaturnType = "string"
  }
  string(field: StringField): void {
    this.#reaturnType = "string"
  }
  number(field: NumberField): void {
    this.#reaturnType = "number"
  }
  rating(field: RatingField): void {
    this.#reaturnType = "number"
  }
  select(field: SelectField): void {
    this.#reaturnType = "string"
  }
  email(field: EmailField): void {
    this.#reaturnType = "string"
  }
  attachment(field: AttachmentField): void {
    this.#reaturnType = "string"
  }
  date(field: DateField): void {
    this.#reaturnType = "date"
  }
  json(field: JsonField): void {
    this.#reaturnType = "string"
  }
  checkbox(field: CheckboxField): void {
    this.#reaturnType = "boolean"
  }
  user(field: UserField): void {
    this.#reaturnType = "string"
  }
  url(field: UrlField): void {
    this.#reaturnType = "string"
  }
  currency(field: CurrencyField): void {
    this.#reaturnType = "number"
  }
  button(field: ButtonField): void {}
  dateRange(field: DateRangeField): void {
    // this.#reaturnType = ["any", "date"]
  }
  duration(field: DurationField): void {
    this.#reaturnType = "number"
  }
  percentage(field: PercentageField): void {
    this.#reaturnType = "number"
  }
  formula(field: FormulaField): void {
    this.#reaturnType = field.returnType
  }
  reference(field: ReferenceField): void {}
  rollup(field: RollupField): void {
    // TODO: get return type from rollup
  }
}
