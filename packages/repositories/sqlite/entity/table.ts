import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import type { IField } from './field'
import { Field } from './field'
import { View } from './view'

@Entity()
export class Table extends BaseEntity {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @OneToMany(() => Field, (field) => field.table)
  fields = new Collection<IField>(this)

  @OneToMany(() => View, (view) => view.table)
  views = new Collection<View>(this)
}
