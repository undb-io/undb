import { ValueObject } from '@egodb/domain'
import { OptionColor } from './option-color'
import { OptionId } from './option-id.vo'
import { OptionName } from './option-name.vo'
import type { IOption } from './option.interface'
import type { ICreateOptionSchema } from './option.schema'

export const isOption = (o?: unknown): o is Option => o instanceof Option

export class Option extends ValueObject<IOption> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public get color() {
    return this.props.color
  }

  static create(input: ICreateOptionSchema): Option {
    return new this({
      id: OptionId.fromNullableString(input.id),
      name: OptionName.create(input.name),
      color: OptionColor.create(input.optionColor),
    })
  }

  static unsafeCrete(input: ICreateOptionSchema): Option {
    return new this({
      id: OptionId.fromNullableString(input.id),
      name: OptionName.unsafeCreate(input.name),
      color: OptionColor.create(input.optionColor),
    })
  }
}
