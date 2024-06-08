import {
  ID_TYPE,
  type AutoIncrementField,
  type CreatedAtField,
  type CreatedByField,
  type IFieldVisitor,
  type IdField,
  type NumberField,
  type ReferenceField,
  type StringField,
  type UpdatedAtField,
  type UpdatedByField,
} from "@undb/table"
import { getTableName } from "drizzle-orm"
import { type ExpressionBuilder, type SelectExpression } from "kysely"
import type { IQueryBuilder } from "../qb"
import { users } from "../tables"
import type { UnderlyingTable } from "../underlying/underlying-table"
import { createDisplayFieldName } from "./record-display-field"

export class RecordSelectFieldVisitor implements IFieldVisitor {
  #select: SelectExpression<any, any>[] = []

  addSelect(select: SelectExpression<any, any>): void {
    this.#select.push(select)
  }

  public select() {
    return this.#select
  }

  private getField(field: string) {
    return `${this.table.name}.${field} as ${field}`
  }

  constructor(
    private readonly table: UnderlyingTable,
    private readonly qb: IQueryBuilder,
    private readonly eb: ExpressionBuilder<any, string>,
  ) {
    this.addSelect(this.getField(ID_TYPE))
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
  reference(field: ReferenceField): void {
    const select = `${field.id.value}.${field.id.value} as ${field.id.value}`
    this.addSelect(select)
  }
}
