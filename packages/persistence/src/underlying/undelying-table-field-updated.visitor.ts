import {
  Options,
  type AttachmentField,
  type AutoIncrementField,
  type ButtonField,
  type CheckboxField,
  type CreatedAtField,
  type CreatedByField,
  type CurrencyField,
  type DateField,
  type DurationField,
  type EmailField,
  type Field,
  type IdField,
  type IFieldVisitor,
  type JsonField,
  type LongTextField,
  type NumberField,
  type PercentageField,
  type RatingField,
  type ReferenceField,
  type RollupField,
  type SelectField,
  type StringField,
  type UpdatedAtField,
  type UpdatedByField,
  type UrlField,
  type UserField,
} from "@undb/table"
import { sql } from "kysely"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { IRecordQueryBuilder } from "../qb"
import type { UnderlyingTable } from "./underlying-table"

export class UnderlyingTableFieldUpdatedVisitor extends AbstractQBMutationVisitor implements IFieldVisitor {
  constructor(
    private readonly qb: IRecordQueryBuilder,
    private readonly table: UnderlyingTable,
    private readonly prev: Field,
  ) {
    super()
  }
  id(field: IdField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  longText(field: LongTextField): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  updatedBy(field: UpdatedByField): void {}
  string(field: StringField): void {}
  number(field: NumberField): void {}
  rating(field: RatingField): void {}
  select(field: SelectField): void {
    const prev = this.prev as SelectField
    const deletedOptions = Options.getDeletedOptions(prev.options, field.options)
    const tableId = this.table.name

    if (field.isSingle) {
      for (const deletedOption of deletedOptions) {
        const sql = this.qb
          .updateTable(tableId)
          .set({ [field.id.value]: null })
          .where(field.id.value, "=", deletedOption)
          .compile()
        this.addSql(sql)
      }
    } else {
      if (deletedOptions.length === 0) {
        return
      }
      const query = this.qb
        .updateTable(tableId)
        .set({
          [field.id.value]: sql`(
          SELECT json_group_array(value)
          FROM json_each(${sql.raw(tableId + "." + field.id.value)})
          WHERE value NOT IN (${sql.join(deletedOptions)})
        )`,
        })
        .where(sql`json_array_length(${sql.raw(tableId + "." + field.id.value)})`, ">", 0)
        .compile()

      this.addSql(query)
    }
  }
  email(field: EmailField): void {}
  attachment(field: AttachmentField): void {}
  date(field: DateField): void {}
  json(field: JsonField): void {}
  checkbox(field: CheckboxField): void {}
  user(field: UserField): void {}
  url(field: UrlField): void {}
  currency(field: CurrencyField): void {}
  button(field: ButtonField): void {}
  duration(field: DurationField): void {}
  percentage(field: PercentageField): void {}
  reference(field: ReferenceField): void {}
  rollup(field: RollupField): void {}
}
