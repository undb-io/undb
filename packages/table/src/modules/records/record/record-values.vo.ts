import { Option, ValueObject, andOptions } from "@undb/domain"
import { z } from "@undb/zod"
import type { RecordComositeSpecification } from "../.."
import type { TableDo } from "../../../table.do"
import type { FieldValue, MutableFieldValue } from "../../schema"
import { FieldIdVo, fieldId, type FieldId, type IFieldId } from "../../schema/fields/field-id.vo"
import { FieldValueFactory } from "../../schema/fields/field-value.factory"
import type { SchemaIdMap } from "../../schema/schema.type"
import type { IRecordReadableValueDTO } from "./dto"

export const recordValues = z.record(fieldId, z.any())

export type IRecordValues = z.infer<typeof recordValues>

export type RecordValues = Record<IFieldId, FieldValue>

export class RecordValuesVO extends ValueObject {
  #map: Map<IFieldId, FieldValue>
  constructor(private values: RecordValues) {
    super(values)
    this.#map = new Map(Object.entries(values))
  }

  static create(table: TableDo, dto: IRecordValues) {
    // TODO: validate value
    // const schema = table.schema.getMutableSchema()
    const fields = table.schema.mutableFields

    const values: RecordValues = {}

    for (const field of fields) {
      let value = dto[field.id.value] ?? dto[field.name.value] ?? null
      if (value === null || value === undefined) {
        const defaultValue = field.defaultValue as Option<MutableFieldValue>
        if (defaultValue.isSome() && field.isDefaultValueValid && !defaultValue.unwrap().isEmpty()) {
          value = defaultValue.unwrap().value
        }
      }
      const fieldValue: Option<MutableFieldValue> = FieldValueFactory.create(field, value)

      let v: MutableFieldValue | undefined = undefined

      if (fieldValue.isSome()) {
        v = fieldValue.unwrap()
      }

      if (v) {
        Reflect.set(values, field.id.value, v)
      }
    }

    return new RecordValuesVO(values)
  }

  static fromJSON(table: TableDo, dto: IRecordValues) {
    const values: RecordValues = {}

    for (const [idOrName, value] of Object.entries(dto)) {
      const field = table.schema.getFieldByIdOrName(idOrName).into(null)
      if (!field) continue

      const fieldValue = FieldValueFactory.fromJSON(field, value)
      if (fieldValue.isSome()) {
        Reflect.set(values, field.id.value, fieldValue.unwrap())
      }
    }

    return new RecordValuesVO(values)
  }

  toJSON(): IRecordValues {
    const values: IRecordValues = {}

    for (const [id, value] of Object.entries(this.values)) {
      values[id] = value.value
    }

    return values
  }

  toReadable(table: TableDo, fieldIds: Set<string>): IRecordReadableValueDTO {
    const schema = table.schema

    const values: IRecordReadableValueDTO = {}

    for (const [id, value] of Object.entries(this.values)) {
      if (!fieldIds.has(id)) {
        continue
      }
      const field = schema.getFieldById(new FieldIdVo(id))
      if (field.isNone()) continue

      // TODO: value.toReadable()
      values[field.unwrap().name.value] = value.value
    }

    return values
  }

  duplicate(schema: SchemaIdMap): RecordValuesVO {
    const values: RecordValues = {}

    for (const [id, value] of Object.entries(this.values)) {
      const field = schema.get(id)
      if (!field || !field.isMutable) continue
      // TODO: every value should have a duplicate method
      values[id] = value
    }

    return new RecordValuesVO(values)
  }

  getValues(fieldIds: Set<string>): RecordValuesVO {
    const values: RecordValues = {}

    for (const [id, value] of Object.entries(this.values)) {
      if (fieldIds.has(id)) {
        values[id] = value
      }
    }

    return new RecordValuesVO(values)
  }

  getValue(fieldId: FieldId): Option<FieldValue> {
    return Option(this.#map.get(fieldId.value))
  }

  getMuttableValues(schema: SchemaIdMap) {
    const values: Record<string, any> = {}

    for (const [id, value] of Object.entries(this.values)) {
      const field = schema.get(id)
      if (!field) continue
      if (!field.isMutable) continue

      values[field.id.value] = value.value
    }

    return values
  }

  setValue(fieldId: FieldId, value: FieldValue) {
    this.#map.set(fieldId.value, value)
    this.values = Object.fromEntries(this.#map)
  }

  toInsertSpec(table: TableDo): Option<RecordComositeSpecification> {
    const specs: Option<RecordComositeSpecification>[] = []
    for (const [id, value] of this.#map) {
      const field = table.schema.getFieldById(new FieldIdVo(id)).into(undefined)
      if (!field || field.isSystem) continue

      const spec = field.getMutationSpec(value as any)
      specs.push(spec)
    }

    return andOptions(...specs) as Option<RecordComositeSpecification>
  }
}
