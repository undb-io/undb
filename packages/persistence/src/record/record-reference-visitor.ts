import {
  type AttachmentField,
  type AutoIncrementField,
  type ButtonField,
  type CheckboxField,
  type CreatedAtField,
  type CreatedByField,
  type CurrencyField,
  type DateField,
  type DateRangeField,
  type DurationField,
  type EmailField,
  type Field,
  type FormulaField,
  ID_TYPE,
  type IFieldVisitor,
  type IdField,
  type JsonField,
  type LongTextField,
  type NumberField,
  type PercentageField,
  type RatingField,
  type ReferenceField,
  type RollupField,
  type SelectField,
  type StringField,
  type TableDo,
  type UpdatedAtField,
  type UpdatedByField,
  type UrlField,
  type UserField,
} from "@undb/table"
import type { SelectQueryBuilder } from "kysely"

export class RecordReferenceVisitor implements IFieldVisitor {
  constructor(
    private qb: SelectQueryBuilder<any, any, any>,
    private readonly table: TableDo,
  ) {}

  join(visibleFields: Field[]): SelectQueryBuilder<any, any, any> {
    const referenceFields = this.table.schema.getReferenceFields(visibleFields)
    const userFields = this.table.schema.getUserFields(visibleFields)
    const fields = [...referenceFields, ...userFields]

    for (const field of fields) {
      field.accept(this)
    }
    return this.qb
  }

  id(field: IdField): void {
    throw new Error("Method not implemented.")
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error("Method not implemented.")
  }
  createdAt(field: CreatedAtField): void {
    throw new Error("Method not implemented.")
  }
  createdBy(field: CreatedByField): void {
    throw new Error("Method not implemented.")
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error("Method not implemented.")
  }
  updatedBy(field: UpdatedByField): void {
    throw new Error("Method not implemented.")
  }
  string(field: StringField): void {
    throw new Error("Method not implemented.")
  }
  longText(field: LongTextField): void {
    throw new Error("Method not implemented.")
  }
  number(field: NumberField): void {
    throw new Error("Method not implemented.")
  }
  button(field: ButtonField): void {
    throw new Error("Method not implemented.")
  }
  currency(field: CurrencyField): void {
    throw new Error("Method not implemented.")
  }
  rating(field: RatingField): void {
    throw new Error("Method not implemented.")
  }
  select(field: SelectField): void {
    throw new Error("Method not implemented.")
  }
  reference(field: ReferenceField): void {
    this.qb = this.qb.leftJoin(field.id.value, `${this.table.id.value}.${ID_TYPE}`, `${field.id.value}.${ID_TYPE}`)
  }
  formula(field: FormulaField): void {
    throw new Error("Method not implemented.")
  }
  percentage(field: PercentageField): void {
    throw new Error("Method not implemented.")
  }
  attachment(field: AttachmentField): void {
    throw new Error("Method not implemented.")
  }
  rollup(field: RollupField): void {
    throw new Error("Method not implemented.")
  }
  email(field: EmailField): void {
    throw new Error("Method not implemented.")
  }
  url(field: UrlField): void {
    throw new Error("Method not implemented.")
  }
  date(field: DateField): void {
    throw new Error("Method not implemented.")
  }
  dateRange(field: DateRangeField): void {
    throw new Error("Method not implemented.")
  }
  json(field: JsonField): void {
    throw new Error("Method not implemented.")
  }
  checkbox(field: CheckboxField): void {
    throw new Error("Method not implemented.")
  }
  duration(field: DurationField): void {
    throw new Error("Method not implemented.")
  }
  user(field: UserField): void {
    if (field.isMultiple) {
      this.qb = this.qb
        .leftJoin(field.id.value, `${this.table.id.value}.${ID_TYPE}`, `${field.id.value}.${ID_TYPE}`)
        .groupBy(`${this.table.id.value}.${ID_TYPE}`)
    }
  }
}
