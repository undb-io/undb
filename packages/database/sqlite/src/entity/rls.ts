import { Cascade, Entity, JsonType, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core'
import { RLS as RLSDO, type RLSPolicyInterface } from '@undb/authz'
import { BaseEntity } from './base.js'
import { Table } from './table.js'
import { View } from './view.js'

@Entity({ tableName: 'undb_rls' })
export class RLS extends BaseEntity {
  constructor(table: Rel<Table>, view: Rel<View>, rls: RLSDO) {
    super()
    this.id = rls.id.value
    this.table = table
    this.view = view
    this.policy = rls.policy
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  @ManyToOne(() => View, { cascade: [Cascade.ALL] })
  view: Rel<View>

  @Property({ type: JsonType })
  policy: RLSPolicyInterface
}
