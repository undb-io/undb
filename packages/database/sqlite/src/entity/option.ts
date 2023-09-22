import {
  Cascade,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from '@mikro-orm/core'
import {
  type Option as CoreOption,
  type OptionColor as CoreOptionColor,
  type IOptionColorName,
  type IOptionColorShade,
} from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { MultiSelectField, SelectField } from './field.js'

@Embeddable()
export class OptionColor {
  constructor(color: CoreOptionColor) {
    this.name = color.name
    this.shade = color.shade
  }

  @Property()
  name: IOptionColorName

  @Enum({ type: 'numeric', items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] })
  shade: IOptionColorShade
}

@Entity({ tableName: 'undb_option' })
export class Option extends BaseEntity {
  constructor(field: Rel<SelectField | MultiSelectField>, option: CoreOption, order: number) {
    super()
    this.key = option.key.value
    this.field = field
    this.name = option.name.value
    this.color = new OptionColor(option.color)
    this.order = order
  }

  @PrimaryKey()
  key: string

  @ManyToOne(() => SelectField || MultiSelectField, { cascade: [Cascade.ALL] })
  field: Rel<SelectField | MultiSelectField>

  @Property()
  @Index()
  name: string

  @Embedded(() => OptionColor)
  color: OptionColor

  @Property()
  @Index()
  order: number
}
