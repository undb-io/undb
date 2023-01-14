import { ValueObject } from '@egodb/domain'
import { OptionColor } from './option-color'
import { OptionKey } from './option-key.vo'
import { OptionName } from './option-name.vo'
import type { IOption } from './option.interface'
import type { ICreateOptionSchema, IMutateOptionSchema } from './option.schema'

export const isOption = (o?: unknown): o is Option => o instanceof Option

export class Option extends ValueObject<IOption> {
  public get key() {
    return this.props.key
  }

  public get name() {
    return this.props.name
  }

  public get color() {
    return this.props.color
  }

  public updateOption(input: IMutateOptionSchema): Option {
    return new Option({
      key: this.key,
      name: input.name ? OptionName.create(input.name) : this.name,
      color: input.color ? OptionColor.create(input.color) : this.color,
    })
  }

  static create(input: ICreateOptionSchema): Option {
    return new this({
      key: OptionKey.fromNullableString(input.key),
      name: OptionName.create(input.name),
      color: OptionColor.create(input.color),
    })
  }

  static unsafeCrete(input: ICreateOptionSchema): Option {
    return new this({
      key: OptionKey.fromNullableString(input.key),
      name: OptionName.unsafeCreate(input.name),
      color: OptionColor.create(input.color),
    })
  }
}
