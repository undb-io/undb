import { Option, ValueObject } from "@undb/domain"
import { ZodSchema, z } from "@undb/zod"
import { objectify } from "radash"
import { WithNewFieldSpecification, WithUpdatedFieldSpecification } from "../../specifications"
import type { ICreateSchemaDTO } from "./dto"
import type { ISchemaDTO } from "./dto/schema.dto"
import {
  CreatedByField,
  FieldIdVo,
  FieldNameVo,
  IdField,
  ReferenceField,
  UpdatedAtField,
  UpdatedByField,
  type IUpdateFieldDTO,
} from "./fields"
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
      CreatedByField.create({ name: "createdBy", type: "createdBy" }),
      UpdatedAtField.create({ name: "updatedAt", type: "updatedAt" }),
      UpdatedByField.create({ name: "updatedBy", type: "updatedBy" }),
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

  $createField(field: Field): WithNewFieldSpecification {
    return new WithNewFieldSpecification(field)
  }

  createField(field: Field) {
    this.fields = [...this.fields, field]
    return this
  }

  $updateField(dto: IUpdateFieldDTO) {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found")
    const updated = FieldFactory.fromJSON(dto)
    return new WithUpdatedFieldSpecification(field, updated)
  }

  updateField(field: Field): Schema {
    return new Schema(this.fields.map((f) => (f.id.equals(field.id) ? field : f)))
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

  get mutateSchema() {
    const schema = objectify(
      this.mutableFields,
      (f) => f.name.value,
      (f) => (f.mutateSchema as Option<ZodSchema>).unwrap(),
    )

    return z.object(schema)
  }

  get searchableFields(): Field[] {
    return this.fields.filter((f) => f.searchable)
  }

  getNextFieldName(defaultName?: string): string {
    return new FieldNameVo(
      getNextName(
        this.fields.map((f) => f.name.value),
        defaultName,
      ),
    ).value
  }

  toJSON(): ISchemaDTO {
    return this.fields.map((field) => field.toJSON())
  }

  getFieldById(fieldId: FieldId): Option<Field> {
    const field = this.fieldMapById.get(fieldId.value)
    return Option(field)
  }

  getDefaultValues() {
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

  getDisplayFields(fieldIds?: Set<string>) {
    return this.fields.filter((f) => (fieldIds ? fieldIds.has(f.id.value) : true) && f.display)
  }

  getReferenceFields(fields: Field[] = this.fields): ReferenceField[] {
    return fields.filter((f) => f instanceof ReferenceField) as ReferenceField[]
  }

  getForeignTableIds(fields: Field[] = this.fields): Set<string> {
    const referenceFields = this.getReferenceFields(fields)

    return new Set(referenceFields.map((f) => f.foreignTableId))
  }
}
