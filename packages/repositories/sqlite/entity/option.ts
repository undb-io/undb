import type { IOptionColorName, IOptionColorShade } from '@egodb/core'
import { Embeddable, Embedded, Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { SelectField } from './field'

@Embeddable()
export class OptionColor {
  @Enum({ type: 'string' })
  name!: IOptionColorName

  @Enum()
  shade!: IOptionColorShade
}

@Entity()
export class Option extends BaseEntity {
  @PrimaryKey()
  id!: string

  @ManyToOne(() => SelectField, { primary: true })
  field!: SelectField;

  [PrimaryKeyType]?: [string, string, string]

  @Property()
  name!: string

  @Embedded(() => OptionColor)
  color!: OptionColor
}
