import { ValueObject } from '@egodb/domain/dist'
import type { FieldValue, ICreateFieldsSchema_internal, IFieldValue } from '../../field'

export class RecordValue extends ValueObject<Map<string, FieldValue>> {
  static fromArray(inputs: ICreateFieldsSchema_internal): RecordValue {
    const values = new Map(
      inputs.map((v) => [
        //
        v.field.name.value,
        v.field.createValue(v.value as never),
      ]),
    )
    return new RecordValue(values)
  }

  public get value() {
    return this.props
  }

  toObject() {
    const obj: Record<string, IFieldValue> = {}
    for (const [key, value] of this.value) {
      obj[key] = value.unpack()
    }
    return obj
  }
}
