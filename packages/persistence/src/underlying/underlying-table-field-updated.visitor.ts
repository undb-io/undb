import { createParser } from "@undb/formula"
import {
  DateRangeField,
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
import type { FormulaField } from "@undb/table/src/modules/schema/fields/variants/formula-field"
import { AlterTableBuilder, sql } from "kysely"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"
import type { IRecordQueryBuilder } from "../qb.type"
import type { IDatabaseFnUtil } from "../utils/fn.util"
import { getUnderlyingFormulaType } from "./underlying-formula.util"
import { UnderlyingFormulaVisitor } from "./underlying-formula.visitor"
import type { UnderlyingTable } from "./underlying-table"

export class UnderlyingTableFieldUpdatedVisitor extends AbstractQBMutationVisitor implements IFieldVisitor {
  constructor(
    private readonly qb: IRecordQueryBuilder,
    private readonly table: UnderlyingTable,
    private readonly prev: Field,
    private readonly tb: AlterTableBuilder,
    private readonly dbFnUtil: IDatabaseFnUtil,
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
  formula(field: FormulaField): void {
    const visitor = new UnderlyingFormulaVisitor(this.table.table)
    const parser = createParser(field.fn)
    const parsed = visitor.visit(parser.formula())

    const drop = this.tb.dropColumn(field.id.value).compile()
    this.addSql(drop)
    const type = getUnderlyingFormulaType(field.returnType)
    const add = this.tb.addColumn(field.id.value, type, (b) => b.generatedAlwaysAs(sql.raw(parsed))).compile()
    this.addSql(add)
  }
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
      const jsonGroupArray = this.dbFnUtil.jsonGroupArray
      const query = this.qb
        .updateTable(tableId)
        .set({
          [field.id.value]: sql`(
          SELECT ${sql.raw(jsonGroupArray)}(value)
          FROM json_each(${sql.raw(`${tableId}."${field.id.value}"`)})
          WHERE value NOT IN (${sql.join(deletedOptions)})
        )`,
        })
        .where(sql`json_array_length(${sql.raw(`${tableId}."${field.id.value}"`)})`, ">", 0)
        .compile()

      this.addSql(query)
    }
  }
  email(field: EmailField): void {}
  attachment(field: AttachmentField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
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
