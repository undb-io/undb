import { ValueObject } from '@egodb/domain'
import { Option as O } from 'oxide.ts'
import { Option } from './option'
import type { ICreateOptionsSchema } from './option.schema'
import { createOptionsSchema } from './option.schema'

export class Options extends ValueObject<Option[]> {
  public get options(): Option[] {
    return this.props
  }

  public getById(id: string): O<Option> {
    return O(this.options.find((o) => o.id.value === id))
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
