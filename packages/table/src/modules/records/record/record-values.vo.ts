import { Option, ValueObject } from '@undb/domain'
import { z } from 'zod'
import type { FieldValue } from '../../schema'
import { fieldId, type FieldId, type IFieldId } from '../../schema/fields/field-id.vo'

export const recordValues = z.record(fieldId, z.any())

export class RecordValuesVO extends ValueObject {
  #map: Map<IFieldId, FieldValue>
  constructor(private readonly values: Record<IFieldId, FieldValue>) {
    super(values)
    this.#map = new Map(Object.entries(values))
  }

  public toJSON() {
    return this.values
  }

  public getValue(fieldId: FieldId): Option<FieldValue> {
    return Option(this.#map.get(fieldId.value))
  }
}
