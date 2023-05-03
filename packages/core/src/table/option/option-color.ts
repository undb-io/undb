import { ValueObject } from '@undb/domain'
import type { ICreateOptionColorSchema, IOptionColor, IOptionColorName, IOptionColorShade } from './option.schema.js'
import { optionColorOrder } from './option.schema.js'

export class OptionColor extends ValueObject<IOptionColor> {
  get name() {
    return this.props.name
  }

  public toJSON() {
    return {
      name: this.name,
      shade: this.shade,
    }
  }

  get shade() {
    return this.props.shade
  }

  static get defaultShade(): IOptionColorShade {
    return 5
  }

  static get defaultColorName(): IOptionColorName {
    return 'indigo'
  }

  static create(input?: ICreateOptionColorSchema): OptionColor {
    return input
      ? new this({
          name: input.name ?? this.defaultColorName,
          shade: input.shade ?? this.defaultShade,
        })
      : this.defaultColor
  }

  static get defaultColor(): OptionColor {
    return new this({
      name: this.defaultColorName,
      shade: this.defaultShade,
    })
  }

  static createColors(inputs: (ICreateOptionColorSchema | undefined)[]): OptionColor[] {
    const colors: OptionColor[] = []

    for (const [index, input] of inputs.entries()) {
      if (!input && colors[index - 1]) {
        colors.push(colors[index - 1].next())
      } else {
        colors.push(OptionColor.create(input))
      }
    }

    return colors
  }

  static nextColorName(colorName?: IOptionColorName): IOptionColorName {
    if (!colorName) return optionColorOrder[0]

    const index = optionColorOrder.indexOf(colorName)
    const nextColorIndex = index === optionColorOrder.length - 1 ? 0 : index + 1
    const nextColorName = optionColorOrder[nextColorIndex]

    return nextColorName
  }

  next(): OptionColor {
    const nextColorName = OptionColor.nextColorName(this.name)
    const shade = this.shade

    return new OptionColor({
      name: nextColorName,
      shade,
    })
  }
}
