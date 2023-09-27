import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { type Base as CoreBase } from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_base' })
export class Base extends BaseEntity {
  constructor(base: CoreBase) {
    super()
    this.id = base.id.value
    this.name = base.name.unpack()
  }

  @PrimaryKey()
  id: string

  @Property()
  name: string

  @OneToMany(() => Table, (table) => table.base, { orphanRemoval: true, cascade: [Cascade.ALL] })
  tables = new Collection<Table>(this)
}
