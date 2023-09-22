import { Entity, PrimaryKey } from '@mikro-orm/core'
import { type Base as CoreBase } from '@undb/core'

@Entity({ tableName: 'undb_base' })
export class Base {
  constructor(base: CoreBase) {
    this.id = base.id.value
  }
  @PrimaryKey()
  id: string
}
