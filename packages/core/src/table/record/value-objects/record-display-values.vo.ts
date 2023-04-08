import { ValueObject } from '@undb/domain'
import type { IRecordDisplayValues } from '../record.type.js'

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
