import { ValueObject } from '@egodb/domain'
import type { ICreateOptionColorSchema, IOptionColor, IOptionColorName, IOptionColorShade } from './option.schema'
import { optionColorOrder } from './option.schema'

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

  next(): OptionColor {
    const index = optionColorOrder.indexOf(this.name)
    const nextColorIndex = index === optionColorOrder.length - 1 ? 0 : index + 1
    const nextColorName = optionColorOrder[nextColorIndex]
    const shade = this.shade

    return new OptionColor({
      name: nextColorName,
      shade,
    })
  }
}
