import { ValueObject } from '@egodb/domain/dist'
import { Option } from 'oxide.ts'
import type { FieldValue, ICreateFieldsSchema_internal, IFieldValue } from '../../field'
import type { TextFieldValue } from '../../field/text-field-value'
import type { ITextFieldValue } from '../../field/text-field.type'
import type { TextField } from '../../field/text.field'

export class RecordValues extends ValueObject<Map<string, FieldValue>> {
  static fromArray(inputs: ICreateFieldsSchema_internal): RecordValues {
    const values = new Map(inputs.map((v) => [v.field.name.value, v.field.createValue(v.value as never)]))
    return new RecordValues(values)
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

  getTextValue(field: TextField): Option<ITextFieldValue> {
    return Option.nonNull(this.value.get(field.name.value)).map((v) => (v as TextFieldValue).unpack())
  }
}
