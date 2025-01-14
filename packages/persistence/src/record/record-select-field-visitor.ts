import {
  ButtonField,
  DateRangeField,
  DurationField,
  ID_TYPE,
  PercentageField,
  type AttachmentField,
  type AutoIncrementField,
  type CheckboxField,
  type CreatedAtField,
  type CreatedByField,
  type CurrencyField,
  type DateField,
  type EmailField,
  type Field,
  type IFieldVisitor,
  type IdField,
  type JsonField,
  type LongTextField,
  type NumberField,
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
import type { FormulaField } from "@undb/table/src/modules/schema/fields/variants/formula-field"
import { getTableName } from "drizzle-orm"
import { sql, type ExpressionBuilder, type SelectExpression } from "kysely"
import type { IDbProvider } from "../db.provider"
import { users } from "../schema/sqlite"
import type { UnderlyingTable } from "../underlying/underlying-table"
import { getDateRangeFieldName } from "../underlying/underlying-table.util"
import type { IDatabaseFnUtil } from "../utils/fn.util"
import { createDisplayFieldName } from "./record-utils"

export class RecordSelectFieldVisitor implements IFieldVisitor {
  #select: SelectExpression<any, any>[] = []

  #addSelect(select: SelectExpression<any, any>): void {
    this.#select.push(select)
  }

  public $select(fields: Field[]): SelectExpression<any, any>[] {
    for (const field of fields) {
      field.accept(this)
    }
    return this.#select
  }

  private getField(field: string) {
    return this.table.getFieldName(field)
  }

  constructor(
    private readonly table: UnderlyingTable,
    private readonly foreignTables: Map<string, TableDo>,
    private readonly eb: ExpressionBuilder<any, string>,
    private readonly dbProvider: IDbProvider,
    private readonly dbFnUtil: IDatabaseFnUtil,
  ) {
    this.#addSelect(this.getField(ID_TYPE))
  }

  #selectSingelUser(field: UserField | CreatedByField | UpdatedByField) {
    const as = createDisplayFieldName(field)
    const user = getTableName(users)

    const name = this.eb
      .selectFrom(user)
      .select(
        this.eb
          .fn(this.dbFnUtil.jsonObject, [
            sql.raw("'username'"),
            this.eb.fn.coalesce(`${user}.${users.username.name}`, sql`NULL`),
            sql.raw("'email'"),
            this.eb.fn.coalesce(`${user}.${users.email.name}`, sql`NULL`),
          ])
          .as(as),
      )
      .whereRef(field.id.value, "=", `${user}.${users.id.name}`)
      .limit(1)
      .as(as)

    this.#addSelect(name)
  }

  select(field: SelectField): void {
    this.#addSelect(this.getField(field.id.value))
  }

  longText(field: LongTextField): void {
    this.#addSelect(this.getField(field.id.value))
  }

  id(field: IdField): void {
    // this.addSelect(this.getField(field.id.value))
  }
  autoIncrement(field: AutoIncrementField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  createdAt(field: CreatedAtField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  createdBy(field: CreatedByField): void {
    this.#addSelect(this.getField(field.id.value))
    this.#selectSingelUser(field)
  }
  updatedBy(field: UpdatedByField): void {
    this.#addSelect(this.getField(field.id.value))
    this.#selectSingelUser(field)
  }
  updatedAt(field: UpdatedAtField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  string(field: StringField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  number(field: NumberField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  button(field: ButtonField): void {}
  currency(field: CurrencyField): void {
    const selection = sql`${sql.raw(`${this.table.name}."${field.id.value}"`)} / 100.0`.as(field.id.value)
    this.#addSelect(selection)
  }
  rating(field: RatingField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  email(field: EmailField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  url(field: UrlField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  json(field: JsonField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  duration(field: DurationField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  percentage(field: PercentageField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  reference(field: ReferenceField): void {
    const select = `${field.id.value}.${field.id.value} as ${field.id.value}`
    this.#addSelect(select)

    const name = createDisplayFieldName(field)

    const foreignTable = this.foreignTables.get(field.foreignTableId)
    if (foreignTable) {
      const displayFields = foreignTable.schema.getDisplayFields()
      const select = this.eb
        .fn(
          this.dbFnUtil.jsonObject,
          displayFields.flatMap((displayField) => [
            sql.raw(`'${displayField.id.value}'`),
            `${field.id.value}.${displayField.id.value}`,
          ]),
        )
        .as(name)

      this.#addSelect(select)
    }
  }
  rollup(field: RollupField): void {
    const select = `${field.referenceFieldId}.${field.id.value} as ${field.id.value}`
    this.#addSelect(select)
  }
  formula(field: FormulaField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  attachment(field: AttachmentField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  date(field: DateField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  dateRange(field: DateRangeField): void {
    const { start, end } = getDateRangeFieldName(field)
    this.#addSelect(this.eb.fn(this.dbFnUtil.jsonArray, [this.getField(start), this.getField(end)]).as(field.id.value))
  }
  checkbox(field: CheckboxField): void {
    this.#addSelect(this.getField(field.id.value))
  }
  user(field: UserField): void {
    const as = createDisplayFieldName(field)
    if (field.isSingle) {
      this.#addSelect(this.getField(field.id.value))
      this.#selectSingelUser(field)
    } else {
      this.#addSelect(this.getField(field.id.value))
      this.#addSelect(
        this.eb
          .case()
          .when(`${this.table.name}.${field.id.value}`, "is", null)
          .then(null)
          .else(
            this.eb.fn(this.dbFnUtil.jsonGroupArray, [
              this.eb.fn(this.dbFnUtil.jsonObject, [
                sql.raw("'username'"),
                this.eb.fn.coalesce(`${field.id.value}.${users.username.name}`, sql`NULL`),
                sql.raw("'email'"),
                this.eb.fn.coalesce(`${field.id.value}.${users.email.name}`, sql`NULL`),
              ]),
            ]),
          )
          .end()
          .as(as),
      )
    }
  }
}
