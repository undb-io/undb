import { Option, ValueObject } from "@undb/domain"
import { z, ZodSchema } from "@undb/zod"
import { objectify } from "radash"
import {
  WithDuplicatedFieldSpecification,
  WithNewFieldSpecification,
  WithoutFieldSpecification,
  WithUpdatedFieldSpecification,
} from "../../specifications"
import type { ICreateSchemaDTO } from "./dto"
import type { ISchemaDTO } from "./dto/schema.dto"
import {
  CreatedByField,
  FieldIdVo,
  FieldNameVo,
  getIsFieldHasDisplayValue,
  ID_TYPE,
  IdField,
  ReferenceField,
  RollupField,
  UpdatedAtField,
  UpdatedByField,
  UserField,
  type FieldId,
  type IDeleteFieldDTO,
  type IDuplicateFieldDTO,
  type IUpdateFieldDTO,
} from "./fields"
import { FieldFactory } from "./fields/field.factory"
import type { Field, MutableFieldValue, NoneSystemField, SystemField } from "./fields/field.type"
import { AutoIncrementField } from "./fields/variants/autoincrement-field"
import { CreatedAtField } from "./fields/variants/created-at-field"
import type { SchemaIdMap, SchemaNameMap } from "./schema.type"
import { getNextName } from "./schema.util"

export class Schema extends ValueObject<Field[]> {
  public fieldMapById: SchemaIdMap
  public fieldMapByName: SchemaNameMap

  private constructor(public fields: Field[]) {
    super(fields)
    const fieldMapById = new Map<string, Field>()
    const fieldMapByName = new Map<string, Field>()
    for (const field of fields) {
      fieldMapById.set(field.id.value, field)
      fieldMapByName.set(field.name.value, field)
    }

    this.fieldMapById = fieldMapById
    this.fieldMapByName = fieldMapByName
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
    return new Schema([...this.fields, field])
  }

  $updateField(dto: IUpdateFieldDTO) {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found")
    const updated = field.update(dto as any)
    return new WithUpdatedFieldSpecification(field, updated)
  }

  updateField(field: Field): Schema {
    return new Schema(this.fields.map((f) => (f.id.equals(field.id) ? field : f)))
  }

  $deleteField(dto: IDeleteFieldDTO) {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found: " + dto.id)
    return new WithoutFieldSpecification(field)
  }

  deleteField(field: Field) {
    return new Schema(this.fields.filter((f) => !f.id.equals(field.id)))
  }

  $duplicateField(dto: IDuplicateFieldDTO): WithDuplicatedFieldSpecification {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found")
    if (field.isSystem) {
      throw new Error("Can't duplicate system field")
    }

    const duplicated = field.duplicate(this.getNextFieldName(field.name.value))

    return new WithDuplicatedFieldSpecification(field, duplicated, dto.includeData)
  }

  get systemFields(): SystemField[] {
    return this.fields.filter((f) => f.isSystem) as SystemField[]
  }

  get noneSystemFields(): NoneSystemField[] {
    return this.fields.filter((f) => !f.isSystem) as NoneSystemField[]
  }

  get mutableFields(): Field[] {
    return this.fields.filter((f) => f.isMutable)
  }

  getMutableSchema(fields = this.mutableFields) {
    const schema = objectify(
      fields.filter((f) => f.isMutable),
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

  getFieldsHasDisplayValue() {
    return this.fields.filter((f) => getIsFieldHasDisplayValue(f.type))
  }

  get displayValuesSchema() {
    const schema = objectify(
      this.getFieldsHasDisplayValue(),
      (f) => f.name.value,
      // TODO: specify display value schema
      (f) => z.any(),
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

  getIdField(): IdField {
    return this.getFieldById(new FieldIdVo(ID_TYPE)).expect("Id field not found") as IdField
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
    const references = fields.filter((f) => f.type === "reference") as ReferenceField[]
    const ids = new Set(references.map((f) => f.id.value))

    const rollupFields = fields.filter((field) => field.type === "rollup") as RollupField[]
    for (const rollup of rollupFields) {
      if (!rollup.referenceFieldId || ids.has(rollup.referenceFieldId)) {
        continue
      }

      const reference = this.getFieldById(new FieldIdVo(rollup.referenceFieldId)).into(undefined)
      if (reference) {
        references.push(reference as ReferenceField)
        ids.add(reference.id.value)
      }
    }

    return references
  }

  getUserFields(fields: Field[] = this.fields): UserField[] {
    return fields.filter((f) => f.type === "user") as UserField[]
  }

  getForeignTableIds(fields: Field[] = this.fields): Set<string> {
    const referenceFields = this.getReferenceFields(fields)

    return new Set(referenceFields.map((f) => f.foreignTableId))
  }

  getRollupFields(fieldId: string): RollupField[] {
    return this.fields.filter((f) => f.type === "rollup" && f.rollupFieldId === fieldId) as RollupField[]
  }
}
