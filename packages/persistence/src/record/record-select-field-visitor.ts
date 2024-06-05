import type {
  AutoIncrementField,
  CreatedAtField,
  CreatedByField,
  IFieldVisitor,
  IdField,
  NumberField,
  StringField,
  UpdatedAtField,
} from "@undb/table"
import { type ExpressionBuilder, type SelectExpression } from "kysely"

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
    const name = this.eb
      .selectFrom("undb_user")
      .select("undb_user.email")
      .whereRef(field.id.value, "=", "undb_user.id")
      .limit(1)
      // TODO: name
      .as("createdBy_name")
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
