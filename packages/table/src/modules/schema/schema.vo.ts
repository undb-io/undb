import { NotImplementException, Option, ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { objectify } from "radash"
import { WithNewFieldSpecification } from "../../specifications"
import type { ICreateSchemaDTO } from "./dto"
import type { ISchemaDTO } from "./dto/schema.dto"
import { FieldNameVo, IdField, UpdatedAtField, type ICreateFieldDTO, type IUpdateFieldDTO } from "./fields"
import type { FieldId } from "./fields/field-id.vo"
import { FieldFactory } from "./fields/field.factory"
import type { Field, MutableFieldValue, NoneSystemField, SystemField } from "./fields/field.type"
import { AutoIncrementField } from "./fields/variants/autoincrement-field"
import { CreatedAtField } from "./fields/variants/created-at-field"
import type { SchemaMap } from "./schema.type"
import { getNextName } from "./schema.util"

export class Schema extends ValueObject<Field[]> {
  public fieldMapById: SchemaMap

  private constructor(public fields: Field[]) {
    super(fields)
    this.fieldMapById = new Map(this.fields.map((field) => [field.id.value, field]))
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

  $updateField(dto: IUpdateFieldDTO) {
    throw new NotImplementException(Schema.name + ".$updateField")
  }

  createField(field: Field) {
    this.fields = [...this.fields, field]
    return this
  }

  get systemFields(): SystemField[] {
    return this.fields.filter((f) => f.isSystem) as SystemField[]
  }

  get noneSystemFields(): NoneSystemField[] {
    return this.fields.filter((f) => !f.isSystem) as NoneSystemField[]
  }

  get displayFields(): Field[] {
    return this.fields.filter((f) => f.display)
  }

  get mutableFields(): Field[] {
    return this.fields.filter((f) => f.isMutable)
  }

  get mutableSchema() {
    const schema = objectify(
      this.mutableFields,
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

  get nextFieldName(): FieldNameVo {
    return new FieldNameVo(getNextName(this.fields.map((f) => f.name.value))).value
  }

  toJSON(): ISchemaDTO {
    return this.fields.map((field) => field.toJSON())
  }

  getFieldById(fieldId: FieldId): Option<Field> {
    const field = this.fieldMapById.get(fieldId.value)
    return Option(field)
  }

  public getDefaultValues() {
    const values: Record<string, any> = {}

    for (const field of this.mutableFields) {
      if (!field) continue
      if (!field.isDefaultValueValid) continue
      const defaultValue = field.defaultValue as Option<MutableFieldValue>
      if (defaultValue.isNone()) continue

      values[field.id.value] = defaultValue.unwrap().value
    }

    return values
  }
}
