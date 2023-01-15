import type {
  IOptionColorName,
  IOptionColorShade,
  Option as CoreOption,
  OptionColor as CoreOptionColor,
} from '@egodb/core'
import { Cascade, Embeddable, Embedded, Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { SelectField } from './field'

@Embeddable()
export class OptionColor {
  constructor(color: CoreOptionColor) {
    this.name = color.name
    this.shade = color.shade
  }

  @Enum({
    items: [
      'dark',
      'gray',
      'red',
      'pink',
      'grape',
      'violet',
      'indigo',
      'blue',
      'cyan',
      'teal',
      'green',
      'lime',
      'yellow',
      'orange',
    ],
  })
  name: IOptionColorName

  @Enum({ items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] })
  shade: IOptionColorShade
}

@Entity()
export class Option extends BaseEntity {
  constructor(field: SelectField, option: CoreOption) {
    super()
    this.key = option.key.value
    this.field = field
    this.name = option.name.value
    this.color = new OptionColor(option.color)
  }

  @PrimaryKey()
  key: string

  @ManyToOne(() => SelectField, { cascade: [Cascade.ALL] })
  field: SelectField

  @Property()
  name: string

  @Embedded(() => OptionColor)
  color: OptionColor
}
