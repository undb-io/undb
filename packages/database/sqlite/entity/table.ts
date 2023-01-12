import type { Table as CoreTable } from '@egodb/core'
import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import type { IField } from './field'
import { Field } from './field'
import { View } from './view'

@Entity()
export class Table extends BaseEntity {
  constructor(table: CoreTable) {
    super()
    this.id = table.id.value
    this.name = table.name.value
  }

  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @OneToMany(() => Field, (field) => field.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  fields = new Collection<IField>(this)

  @OneToMany(() => View, (view) => view.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  views = new Collection<View>(this)
}
