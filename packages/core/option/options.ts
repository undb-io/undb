import { ValueObject } from '@egodb/domain'
import arrayMove from 'array-move'
import { Option as O } from 'oxide.ts'
import { Option } from './option'
import type { ICreateOptionsSchema } from './option.schema'
import { createOptionsSchema } from './option.schema'

export class Options extends ValueObject<Option[]> {
  public get options(): Option[] {
    return this.props
  }

  public reorder(from: string, to: string): Options {
    const formIndex = this.options.findIndex((o) => o.id.value === from)
    const toIndex = this.options.findIndex((o) => o.id.value === to)
    const moved = arrayMove(this.options, formIndex, toIndex)
    return new Options(moved)
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
