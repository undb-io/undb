import type {
  AutoIncrementField,
  CreatedAtField,
  CreatedByField,
  IFieldVisitor,
  IdField,
  NumberField,
  StringField,
  UpdatedAtField,
  UpdatedByField,
} from "@undb/table"
import { getTableName } from "drizzle-orm"
import { type ExpressionBuilder, type SelectExpression } from "kysely"
import { users } from "../tables"
import { createDisplayFieldName } from "./record-display-field"

export class RecordSelectFieldVisitor implements IFieldVisitor {
  #select: SelectExpression<any, any>[] = []

  addSelect(select: SelectExpression<any, any>): void {
    this.#select.push(select)
  }

  public select() {
    return this.#select
  }

  constructor(private readonly eb: ExpressionBuilder<any, string>) {}
  id(field: IdField): void {
    this.addSelect(field.id.value)
  }
  autoIncrement(field: AutoIncrementField): void {
    this.addSelect(field.id.value)
  }
  createdAt(field: CreatedAtField): void {
    this.addSelect(field.id.value)
  }
  createdBy(field: CreatedByField): void {
    this.addSelect(field.id.value)
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
    this.addSelect(field.id.value)
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
    this.addSelect(field.id.value)
  }
  string(field: StringField): void {
    this.addSelect(field.id.value)
  }
  number(field: NumberField): void {
    this.addSelect(field.id.value)
  }
}
