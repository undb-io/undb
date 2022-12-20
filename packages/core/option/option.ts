import { ValueObject } from '@egodb/domain'
import type { ICreateOptionSchema, IOptionSchema } from './option.schema'
import { createOptionSchema } from './option.schema'

export const isOption = (o?: unknown): o is Option => o instanceof Option

export class Option extends ValueObject<IOptionSchema> {
  public get name() {
    return this.props.name
  }

  static create(input: ICreateOptionSchema): Option {
    return new this(createOptionSchema.parse(input))
  }

  static unsafeCrete(input: ICreateOptionSchema): Option {
    return new this(input)
  }
}
