import { ValueObject } from '@undb/domain'
import { OptionColor } from './option-color.js'
import { OptionKey } from './option-key.vo.js'
import { OptionName } from './option-name.vo.js'
import type { IOption } from './option.interface.js'
import type { ICreateOptionSchema, IMutateOptionSchema, IOptionSchema } from './option.schema.js'

export const isOption = (o?: unknown): o is Option => o instanceof Option

export class Option extends ValueObject<IOption> {
  public duplicate(): Option {
    return Option.create({
      ...this.toJSON(),
      key: OptionKey.createId(),
    })
  }

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

  public toJSON(): IOptionSchema {
    return {
      key: this.key.value,
      name: this.name.value,
      color: this.color.toJSON(),
    }
  }
}
