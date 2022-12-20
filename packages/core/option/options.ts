import { ValueObject } from '@egodb/domain'
import { Option } from './option'
import type { ICreateOptionsSchema } from './option.schema'
import { createOptionsSchema } from './option.schema'

export class Options extends ValueObject<Option[]> {
  public get options(): Option[] {
    return this.props
  }

  static create(inputs: ICreateOptionsSchema) {
    inputs = createOptionsSchema.parse(inputs)
    const options = inputs.map((i) => Option.create(i))
    return new this(options)
  }

  static unsafeCreate(inputs: ICreateOptionsSchema) {
    const options = inputs.map((i) => Option.unsafeCrete(i))
    return new this(options)
  }
}
