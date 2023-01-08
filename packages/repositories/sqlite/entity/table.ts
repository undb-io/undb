import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Field } from './field'

@Entity({ tableName: 'tables' })
export class Table {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @OneToMany(() => Field, (field) => field.table)
  fields = new Collection<Field>(this)
}
