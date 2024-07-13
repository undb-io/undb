import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { Field } from "../modules"
import type { FieldValueObject } from "../modules/schema/fields/field-value"
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
    t.schema = t.schema.createField(this.field)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewField(this)
    return Ok(undefined)
  }
}

export class WithUpdatedFieldSpecification extends TableComositeSpecification {
  constructor(
    public readonly previous: Field,
    public readonly field: Field,
  ) {
    super()
  }
  public getIsTypeChanged(): boolean {
    return this.previous.type !== this.field.type
  }

  public getShouldSetNewDefaultValue(): boolean {
    const previousValue = (this.previous.defaultValue as Option<FieldValueObject<any>>).into(undefined)
    const newValue = (this.field.defaultValue as Option<FieldValueObject<any>>).into(undefined)

    if (!newValue || newValue.isEmpty()) {
      return false
    }

    if (!previousValue && newValue) {
      return true
    }

    if (previousValue && newValue && !previousValue.equals(newValue)) {
      return true
    }

    return false
  }

  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithUpdatedFieldSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.schema = t.schema.updateField(this.field)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withUpdatedField(this)
    return Ok(undefined)
  }
}
