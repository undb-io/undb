import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { type Base as CoreBase } from '@undb/core'

@Entity({ tableName: 'undb_base' })
export class Base {
  constructor(base: CoreBase) {
    this.id = base.id.value
    this.name = base.name.unpack()
  }

  @PrimaryKey()
  id: string

  @Property()
  name: string
}
