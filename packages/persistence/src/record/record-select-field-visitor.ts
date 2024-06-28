import {
  AttachmentField,
  CheckboxField,
  DateField,
  ID_TYPE,
  JsonField,
  RatingField,
  SelectField,
  type AutoIncrementField,
  type CreatedAtField,
  type CreatedByField,
  type Field,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type ReferenceField,
  type RollupField,
  type StringField,
  type TableDo,
  type UpdatedAtField,
  type UpdatedByField,
} from "@undb/table"
import type { EmailField } from "@undb/table/src/modules/schema/fields/variants/email-field"
import { getTableName } from "drizzle-orm"
import { sql, type ExpressionBuilder, type SelectExpression } from "kysely"
import { users } from "../tables"
import type { UnderlyingTable } from "../underlying/underlying-table"
import { createDisplayFieldName } from "./record-utils"

export class RecordSelectFieldVisitor implements IFieldVisitor {
  #select: SelectExpression<any, any>[] = []

  addSelect(select: SelectExpression<any, any>): void {
    this.#select.push(select)
  }

  public $select(fields: Field[]): SelectExpression<any, any>[] {
    for (const field of fields) {
      field.accept(this)
    }
    return this.#select
  }

  private getField(field: string) {
    return `${this.table.name}.${field} as ${field}`
  }

  constructor(
    private readonly table: UnderlyingTable,
    private readonly foreignTables: Map<string, TableDo>,
    private readonly eb: ExpressionBuilder<any, string>,
  ) {
    this.addSelect(this.getField(ID_TYPE))
  }
  select(field: SelectField): void {
    this.addSelect(this.getField(field.id.value))
  }

  id(field: IdField): void {
    // this.addSelect(this.getField(field.id.value))
  }
  autoIncrement(field: AutoIncrementField): void {
    this.addSelect(this.getField(field.id.value))
  }
  createdAt(field: CreatedAtField): void {
    this.addSelect(this.getField(field.id.value))
  }
  createdBy(field: CreatedByField): void {
    this.addSelect(this.getField(field.id.value))
    const user = getTableName(users)
    const as = createDisplayFieldName(field)

    const name = this.eb
      .selectFrom(user)
      .select(`${user}.${users.username.name}`)
      .whereRef(field.id.value, "=", `${user}.${users.id.name}`)
      .limit(1)
      .as(as)

    this.addSelect(name)
  }

  updatedBy(field: UpdatedByField): void {
    this.addSelect(this.getField(field.id.value))
    const user = getTableName(users)
    const as = createDisplayFieldName(field)

    const name = this.eb
      .selectFrom(user)
      .select(`${user}.${users.username.name}`)
      .whereRef(field.id.value, "=", `${user}.${users.id.name}`)
      .limit(1)
      .as(as)

    this.addSelect(name)
  }
  updatedAt(field: UpdatedAtField): void {
    this.addSelect(this.getField(field.id.value))
  }
  string(field: StringField): void {
    this.addSelect(this.getField(field.id.value))
  }
  number(field: NumberField): void {
    this.addSelect(this.getField(field.id.value))
  }
  rating(field: RatingField): void {
    this.addSelect(this.getField(field.id.value))
  }
  email(field: EmailField): void {
    this.addSelect(this.getField(field.id.value))
  }
  json(field: JsonField): void {
    this.addSelect(this.getField(field.id.value))
  }
  reference(field: ReferenceField): void {
    const select = `${field.id.value}.${field.id.value} as ${field.id.value}`
    this.addSelect(select)

    const name = createDisplayFieldName(field)

    const foreignTable = this.foreignTables.get(field.foreignTableId)
    if (foreignTable) {
      const displayFields = foreignTable.schema.getDisplayFields()
      const select = this.eb
        .fn(
          "json_object",
          displayFields.flatMap((displayField) => [
            sql.raw(`'${displayField.id.value}'`),
            `${field.id.value}.${displayField.id.value}`,
          ]),
        )
        .as(name)

      this.addSelect(select)
    }
  }
  rollup(field: RollupField): void {
    const select = `${field.referenceFieldId}.${field.id.value} as ${field.id.value}`
    this.addSelect(select)
  }
  attachment(field: AttachmentField): void {
    this.addSelect(this.getField(field.id.value))
  }
  date(field: DateField): void {
    this.addSelect(this.getField(field.id.value))
  }
  checkbox(field: CheckboxField): void {
    this.addSelect(this.getField(field.id.value))
  }
}
