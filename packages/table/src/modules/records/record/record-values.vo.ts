import { Option, ValueObject } from '@undb/domain'
import { z } from 'zod'
import type { TableDo } from '../../../table.do'
import type { FieldValue } from '../../schema'
import { FieldIdVo, fieldId, type FieldId, type IFieldId } from '../../schema/fields/field-id.vo'
import { FieldValueFactory } from '../../schema/fields/field-value.factory'

export const recordValues = z.record(fieldId, z.any())

export type IRecordValues = z.infer<typeof recordValues>

type RecordValues = Record<IFieldId, FieldValue>

export class RecordValuesVO extends ValueObject {
  #map: Map<IFieldId, FieldValue>
  constructor(private readonly values: RecordValues) {
    super(values)
    this.#map = new Map(Object.entries(values))
  }

  static create(table: TableDo, dto: IRecordValues) {
    const values: RecordValues = {}

    for (const [id, value] of Object.entries(dto)) {
      const fieldId = new FieldIdVo(id)
      const field = table.schema.getFieldById(fieldId).expect('Field not found')
      const fieldValue = FieldValueFactory.create(field, value)
      Reflect.set(values, fieldId.value, fieldValue)
    }

    return new RecordValuesVO(values)
  }

  public toJSON() {
    const values: IRecordValues = {}

    for (const [id, value] of Object.entries(this.values)) {
      values[id] = value.value
    }

    return values
  }

  public getValue(fieldId: FieldId): Option<FieldValue> {
    return Option(this.#map.get(fieldId.value))
  }
}
