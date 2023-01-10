import type {
  IOptionColorName,
  IOptionColorShade,
  Option as CoreOption,
  OptionColor as CoreOptionColor,
} from '@egodb/core'
import { Embeddable, Embedded, Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { SelectField } from './field'

@Embeddable()
export class OptionColor {
  constructor(color: CoreOptionColor) {
    this.name = color.name
    this.shade = color.shade
  }

  @Enum({ type: 'string' })
  name: IOptionColorName

  @Enum()
  shade: IOptionColorShade
}

@Entity()
export class Option extends BaseEntity {
  constructor(field: SelectField, option: CoreOption) {
    super()
    this.id = option.id.value
    this.field = field
    this.name = option.name.value
    this.color = new OptionColor(option.color)
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => SelectField, { primary: true })
  field: SelectField;

  [PrimaryKeyType]?: [string, string, string]

  @Property()
  name: string

  @Embedded(() => OptionColor)
  color: OptionColor
}
