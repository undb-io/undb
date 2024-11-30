import { andOptions, None, Option, Some, ValueObject } from "@undb/domain"
import { getNextName } from "@undb/utils"
import { z, ZodSchema } from "@undb/zod"
import { objectify } from "radash"
import {
  WithDuplicatedFieldSpecification,
  WithNewFieldSpecification,
  WithoutFieldSpecification,
  WithUpdatedFieldSpecification,
} from "../../specifications"
import type { TableDo } from "../../table.do"
import type { FormVO } from "../forms"
import type { IRecordValues } from "../records/record/record-values.vo"
import { type IPivotAggregate, type View } from "../views"
import { isValidColumnLabel, isValidRowLabel, isValidValueField } from "../views/view/variants/pivot-view.vo"
import type { ICreateSchemaDTO } from "./dto"
import type { ISchemaDTO } from "./dto/schema.dto"
import {
  ButtonField,
  CreatedByField,
  FieldConstraintVO,
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

  static create(table: TableDo, dto: ICreateSchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.create(table, field))
    const schema = new Schema([
      IdField.create({ name: "id", type: "id" }),
      ...fields,
      CreatedAtField.create({ name: "createdAt", type: "createdAt" }),
      CreatedByField.create({ name: "createdBy", type: "createdBy" }),
      UpdatedAtField.create({ name: "updatedAt", type: "updatedAt" }),
      UpdatedByField.create({ name: "updatedBy", type: "updatedBy" }),
      AutoIncrementField.create({ name: "autoIncrement", type: "autoIncrement" }),
    ])

    return schema
  }

  static fromJSON(dto: ISchemaDTO): Schema {
    const fields = dto.map((field) => FieldFactory.fromJSON(field))
    const schema = new Schema(fields)

    return schema
  }

  *[Symbol.iterator]() {
    yield* this.fields
  }

  $createField(field: Field): WithNewFieldSpecification {
    return new WithNewFieldSpecification(field)
  }

  reorderFields(fieldsOrder: string[]): Schema {
    const orderedFields: Field[] = []
    const fieldSet = new Set(fieldsOrder)

    // 首先添加按照 fieldsOrder 排序的字段
    for (const idOrName of fieldsOrder) {
      const field = this.fieldMapById.get(idOrName) || this.fieldMapByName.get(idOrName)
      if (field) {
        orderedFields.push(field)
      }
    }

    // 添加未在 fieldsOrder 中指定的字段
    for (const field of this.fields) {
      if (!fieldSet.has(field.id.value) && !fieldSet.has(field.name.value)) {
        orderedFields.push(field)
      }
    }

    return new Schema(orderedFields)
  }

  createField(field: Field) {
    return new Schema([...this.fields, field])
  }

  $updateField(table: TableDo, dto: IUpdateFieldDTO) {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found")
    if (dto.type !== field.type) {
      // TODO: handle typescript issue
      // @ts-ignore
      const newField = FieldFactory.fromJSON({ ...field.toJSON(), ...dto })
      return new WithUpdatedFieldSpecification(field, newField)
    }
    const updated = field.clone().update(table, dto as any)
    return new WithUpdatedFieldSpecification(field, updated)
  }

  updateField(field: Field): Schema {
    return new Schema(this.fields.map((f) => (f.id.equals(field.id) ? field : f)))
  }

  $deleteField(dto: IDeleteFieldDTO) {
    const field = this.getFieldById(new FieldIdVo(dto.id)).expect("Field not found: " + dto.id)
    const spec = new WithoutFieldSpecification(field)

    const specs = this.fields.map((f) => f.$onOtherFieldDeleted(field))

    return andOptions(Some(spec), ...specs)
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

  getMutableSchema(fields = this.mutableFields, useFieldId = true) {
    const schema = objectify(
      fields.filter((f) => f.isMutable),
      (f) => (useFieldId ? f.id.value : f.name.value),
      (f) => (f.mutateSchema as Option<ZodSchema>).unwrapOr(z.undefined()),
    )

    return z.object(schema)
  }

  getMutableSchemaFromForm(form: FormVO, fields = this.mutableFields, useFieldId = true) {
    const visibleFields = form.fields.getVisibleFields()
    const set = new Set(visibleFields.map((f) => f.fieldId))
    const schema = objectify(
      fields.filter((f) => f.isMutable && set.has(f.id.value)),
      (f) => (useFieldId ? f.id.value : f.name.value),
      (f) => {
        const formField = form.fields.getFormField(f.id.value)
        if (formField.isNone()) {
          return z.undefined()
        }
        const c = f.getConstraintFromFormField(formField.unwrap()) as FieldConstraintVO | undefined
        if (c) {
          return c.schema
        }
        return z.undefined()
      },
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

  getFieldsHasDisplayValue(fields: Field[] = this.fields) {
    return fields.filter((f) => getIsFieldHasDisplayValue(f.type))
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

  getViewDisplayValuesSchema(table: TableDo, view: View) {
    const fields = table.getOrderedVisibleFields(view.id.value)
    const schema = objectify(
      this.getFieldsHasDisplayValue(fields),
      (f) => f.name.value,
      (f) => z.any(),
    )

    return z.object(schema)
  }

  get readableSchema() {
    const schema = objectify(
      this.fields.filter((f) => f.type !== "button"),
      (f) => f.name.value,
      (f) => f.valueSchema,
    )

    return z.object(schema)
  }

  getViewReadableSchema(table: TableDo, view: View) {
    const viewFields = table.getOrderedVisibleFields(view.id.value).filter((f) => f.type !== "button")
    const schema = objectify(
      viewFields,
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

  getFieldByName(name: string): Option<Field> {
    const field = this.fieldMapByName.get(name)
    return Option(field)
  }

  getFieldByIdOrName(idOrName: string): Option<Field> {
    const field = this.fieldMapById.get(idOrName) || this.fieldMapByName.get(idOrName)
    return Option(field)
  }

  getIdField(): IdField {
    return this.getFieldById(new FieldIdVo(ID_TYPE)).expect("Id field not found") as IdField
  }

  getDefaultValues(): IRecordValues {
    const values: IRecordValues = {}

    for (const field of this.mutableFields) {
      if (!field) continue
      if (!field.isDefaultValueValid) continue
      const defaultValue = field.defaultValue as Option<MutableFieldValue>
      if (defaultValue.isNone()) continue

      values[field.id.value] = defaultValue.unwrap().value
    }

    return values
  }

  getDefaultDisplayField(fieldIds?: Set<string>): Option<Field> {
    const displayFields = this.getDisplayFields(fieldIds)
    if (displayFields.length === 0) return None
    return Some(displayFields[0])
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

  getButtonFields(fields: Field[] = this.fields): ButtonField[] {
    return fields.filter((f) => f.type === "button") as ButtonField[]
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

  getKanbanFields(fields: Field[] = this.fields) {
    return fields.filter((f) => f.type === "select" && f.isSingle)
  }

  getCalendarFields(fields: Field[] = this.fields) {
    // TODO: add date range field
    return fields.filter((f) => f.type === "date")
  }

  getGalleryFields(fields: Field[] = this.fields) {
    return fields.filter((f) => f.type === "attachment")
  }

  getPivotFields(type: "column" | "row", fields: Field[] = this.fields) {
    if (type === "column") {
      return fields.filter(isValidColumnLabel)
    }

    return fields.filter(isValidRowLabel)
  }

  getPivotValueFields(aggregate: IPivotAggregate, fields: Field[] = this.fields) {
    return fields.filter((field) => isValidValueField(aggregate, field))
  }
}
