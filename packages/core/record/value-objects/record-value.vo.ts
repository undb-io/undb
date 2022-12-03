import { ValueObject } from '@egodb/domain/dist'
import type { FieldValue, ICreateFieldsSchema_internal } from '../../field'

export class RecordValue extends ValueObject<Map<string, FieldValue>> {
  static fromArray(inputs: ICreateFieldsSchema_internal): RecordValue {
    const values = new Map(
      inputs.map((v) => [
        //
        v.field.id.value,
        v.field.createValue(v.value as never),
      ]),
    )
    return new RecordValue(values)
  }
}
