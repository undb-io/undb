import { Option, ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { objectify } from "radash"
import { WithNewFieldSpecification } from "../../specifications"
import type { ICreateSchemaDTO } from "./dto"
import type { ISchemaDTO } from "./dto/schema.dto"
import { IdField, UpdatedAtField } from "./fields"
import type { FieldId } from "./fields/field-id.vo"
import { FieldFactory } from "./fields/field.factory"
import type { Field, ICreateFieldDTO, NoneSystemField, SystemField } from "./fields/field.type"
import { AutoIncrementField } from "./fields/variants/autoincrement-field"
import { CreatedAtField } from "./fields/variants/created-at-field"
import type { SchemaMap } from "./schema.type"

export class Schema extends ValueObject<Field[]> {
  private constructor(public readonly fields: Field[]) {
    super(fields)
  }

  static create(dto: ICreateSchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.create(field))
    return new Schema([
      IdField.create({ name: "id", type: "id" }),
      ...fields,
      CreatedAtField.create({ name: "createdAt", type: "createdAt" }),
      UpdatedAtField.create({ name: "updatedAt", type: "updatedAt" }),
      AutoIncrementField.create({ name: "autoIncrement", type: "autoIncrement" }),
    ])
  }

  static fromJSON(dto: ISchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.fromJSON(field))
    return new Schema(fields)
  }

  *[Symbol.iterator]() {
    yield* this.fields
  }

  $createField(dto: ICreateFieldDTO): WithNewFieldSpecification {
    const field = FieldFactory.create(dto)

    return new WithNewFieldSpecification(field)
  }

  createField(field: Field) {
    this.fields.push(field)
  }

  get fieldMapById(): SchemaMap {
    return new Map(this.fields.map((field) => [field.id.value, field]))
  }

  get systemFields(): SystemField[] {
    return this.fields.filter((f) => f.isSystem) as SystemField[]
  }

  get noneSystemFields(): NoneSystemField[] {
    return this.fields.filter((f) => !f.isSystem) as NoneSystemField[]
  }

  get mutableSchema() {
    const schema = objectify(
      this.fields.filter((f) => f.isMutable),
      (f) => f.id.value,
      (f) => f.valueSchema,
    )

    return z.object(schema)
  }

  get valuesSchema() {
    const schema = objectify(
      this.fields,
      (f) => f.id.value,
      (f) => f.valueSchema,
    )

    return z.object(schema)
  }

  get readableSchema() {
    const schema = objectify(
      this.fields,
      (f) => f.name.value,
      (f) => f.valueSchema,
    )

    return z.object(schema)
  }

  get searchableFields(): Field[] {
    return this.fields.filter((f) => f.searchable)
  }

  toJSON(): ISchemaDTO {
    return this.fields.map((field) => field.toJSON())
  }

  getFieldById(fieldId: FieldId): Option<Field> {
    const field = this.fields.find((f) => f.id.equals(fieldId))
    return Option(field)
  }
}
