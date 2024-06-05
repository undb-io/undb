import { Option, ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import type { TableDo } from "../../../table.do"
import type { FieldValue } from "../../schema"
import { FieldIdVo, fieldId, type FieldId, type IFieldId } from "../../schema/fields/field-id.vo"

export const recordDisplayValues = z.record(fieldId, z.any())

export type IRecordDisplayValues = z.infer<typeof recordDisplayValues>

type RecordDisplayValues = Record<IFieldId, any>

export class RecordDisplayValuesVO extends ValueObject {
  #map: Map<IFieldId, FieldValue>
  constructor(private values: RecordDisplayValues) {
    super(values)
    this.#map = new Map(Object.entries(values))
  }

  static fromJSON(table: TableDo, dto: IRecordDisplayValues) {
    const values: RecordDisplayValues = {}

    for (const [id, value] of Object.entries(dto)) {
      const fieldId = new FieldIdVo(id)
      const field = table.schema.getFieldById(fieldId).into(null)
      if (!field) continue

      Reflect.set(values, fieldId.value, value)
    }

    return new RecordDisplayValuesVO(values)
  }

  public toJSON(): IRecordDisplayValues {
    const values: IRecordDisplayValues = {}

    for (const [id, value] of Object.entries(this.values)) {
      values[id] = value.value
    }

    return values
  }

  public getValue(fieldId: FieldId): Option<any> {
    return Option(this.#map.get(fieldId.value))
  }
}
