import { Ok, Option, WontImplementException, type Result } from "@undb/domain"
import type { FieldValueObject } from "../modules/schema/fields/field-value"
import type { Field } from "../modules/schema/fields/field.type"
import { SelectField } from "../modules/schema/fields/variants/select-field/select-field.vo"
import { UserField } from "../modules/schema/fields/variants/user-field/user-field.vo"
import type { Schema } from "../modules/schema/schema.vo"
import type { TableId } from "../table-id.vo"
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

    for (const field of t.schema.fields) {
      if (field.type === "formula") {
        field.setMetadata(t)
      }
    }

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

export class WithDuplicatedFieldSpecification extends TableComositeSpecification {
  constructor(
    public readonly originalField: Field,
    public readonly field: Field,
    public readonly includeData: boolean,
  ) {
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
    v.withDuplicateField(this)
    return Ok(undefined)
  }
}
export class WithoutFieldSpecification extends TableComositeSpecification {
  constructor(public readonly field: Field) {
    super()
  }

  isSatisfiedBy(t: TableDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.schema = t.schema.deleteField(this.field)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutField(this)
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

  public getIsChangeItemSize(): boolean {
    if (this.getIsTypeChanged()) {
      return false
    }

    const { previous, field } = this
    if (
      (field instanceof SelectField && previous instanceof SelectField) ||
      (field instanceof UserField && previous instanceof UserField)
    ) {
      return (field.isSingle && !previous.isSingle) || (!field.isSingle && previous.isSingle)
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

export class WithForeignRollupFieldSpec extends TableComositeSpecification {
  constructor(public readonly fieldId: string) {
    super()
  }

  isSatisfiedBy(t: TableDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withForeignRollupField(this)
    return Ok(undefined)
  }
}

export class WithTableForeignTablesSpec extends TableComositeSpecification {
  constructor(public readonly tableId: TableId) {
    super()
  }

  isSatisfiedBy(t: TableDo): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withTableForeignTables(this)
    return Ok(undefined)
  }
}
