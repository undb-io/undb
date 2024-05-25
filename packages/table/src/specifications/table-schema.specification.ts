import { Ok, WontImplementException, type Result } from "@undb/domain"
import type { Field } from "../modules"
import type { Schema } from "../modules/schema/schema.vo"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableSchemaSpecification extends TableComositeSpecification {
  constructor(public readonly schema: Schema) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    return t.name.equals(this.schema)
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.schema = this.schema
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withSchema(this)
    return Ok(undefined)
  }
}

export class WithNewFieldSpecification extends TableComositeSpecification {
  constructor(public readonly field: Field) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithNewFieldSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.schema.createField(this.field)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewField(this)
    return Ok(undefined)
  }
}
