import { ValueObject } from '@egodb/domain'
import type { IOptionColor, IOptionColorName, IOptionColorShade } from './option.schema'

export class OptionColor extends ValueObject<IOptionColor> {
  get name() {
    return this.props.name
  }

  get shade() {
    return this.props.shade
  }

  private static get defaultShade(): IOptionColorShade {
    return 5
  }

  private static get defaultColorName(): IOptionColorName {
    return 'indigo'
  }

  static create(input?: IOptionColor): OptionColor {
    return input ? new this(input) : this.defaultColor
  }

  static get defaultColor(): OptionColor {
    return new this({
      name: this.defaultColorName,
      shade: this.defaultShade,
    })
  }
}
