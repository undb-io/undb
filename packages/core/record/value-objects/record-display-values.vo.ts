import { ValueObject } from '@egodb/domain'
import type { IRecordDisplayValues } from '../record.type'

export class RecordDisplayValues extends ValueObject<IRecordDisplayValues> {
  public get values() {
    return this.props
  }

  public static empty() {
    return new this({})
  }

  *[Symbol.iterator]() {
    yield* Object.entries(this.values)
  }
}
