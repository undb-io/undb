import type { Table as CoreTable } from '@egodb/core'
import { ArrayType, Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.js'
import type { IField } from './field.js'
import { Field, ReferenceField } from './field.js'
import { View } from './view.js'

@Entity({ tableName: 'ego_table' })
export class Table extends BaseEntity {
  constructor(table: CoreTable) {
    super()
    this.id = table.id.value
    this.name = table.name.value
    this.viewsOrder = table.viewsOrder.toJSON()
  }

  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @OneToMany(() => Field, (field) => field.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  fields = new Collection<IField>(this)

  @OneToMany(() => View, (view) => view.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  views = new Collection<View>(this)

  @OneToMany(() => ReferenceField, (field) => field.foreignTable)
  referencedBy = new Collection<ReferenceField>(this)

  @Property({ type: ArrayType, nullable: true })
  viewsOrder: string[]
}
