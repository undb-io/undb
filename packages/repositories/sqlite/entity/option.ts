import { Embeddable, Embedded, Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Field } from './field'

@Embeddable()
export class OptionColor {
  @Property()
  name!: string

  @Property()
  shade!: number
}

@Entity({ tableName: 'options' })
export class Option extends BaseEntity {
  @PrimaryKey()
  id!: string

  @ManyToOne(() => Field, { primary: true })
  field!: Field;

  [PrimaryKeyType]?: [string, string, string]

  @Property()
  name!: string

  @Embedded(() => OptionColor)
  color!: OptionColor
}
