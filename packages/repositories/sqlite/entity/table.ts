import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Field } from './field'

@Entity()
export class Table extends BaseEntity {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @OneToMany(() => Field, (field) => field.table)
  fields = new Collection<Field>(this)
}
