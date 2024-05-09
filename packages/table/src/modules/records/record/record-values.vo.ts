import { Option, ValueObject } from '@undb/domain'
import type { FieldValue } from '../../schema'
import type { FieldId, IFieldId } from '../../schema/fields/field-id.vo'

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
