import {
  Cascade,
  Embeddable,
  Embedded,
  Entity,
  JsonType,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from '@mikro-orm/core'
import { RLS as RLSDO, type IRLSAction, type RLSPolicyInterface } from '@undb/authz'
import { type IRootFilter } from '@undb/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'
import { View } from './view.js'

@Embeddable()
export class RLSPolicy {
  constructor(policy: RLSPolicyInterface) {
    this.action = policy.action
    this.filter = policy.filter
  }

  @Property()
  action: IRLSAction

  @Property({ type: JsonType })
  filter: IRootFilter
}

@Entity({ tableName: 'undb_rls' })
export class RLS extends BaseEntity {
  constructor(table: Rel<Table>, view: Rel<View> | undefined, rls: RLSDO) {
    super()
    this.id = rls.id.value
    this.table = table
    this.view = view
    this.policy = new RLSPolicy(rls.policy)
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  @ManyToOne(() => View, { cascade: [Cascade.ALL], nullable: true })
  view?: Rel<View>

  @Embedded(() => RLSPolicy)
  policy: RLSPolicy
}
