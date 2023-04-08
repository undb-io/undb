import { ValueObject } from '@undb/domain'
import { optionNameSchema } from './option.schema.js'

export class OptionName extends ValueObject<string> {
  private constructor(value: string) {
    super({ value })
  }

  public get value() {
    return this.props.value
  }

  static create(value: string): OptionName {
    return new this(optionNameSchema.parse(value))
  }

  static unsafeCreate(value: string): OptionName {
    return new this(value)
  }
}
