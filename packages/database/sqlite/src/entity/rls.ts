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
import type { ISubject } from '@undb/authz'
import { RLS as RLSDO, type IRLSAction, type RLSPolicyInterface } from '@undb/authz'
import { type IRootFilter } from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'

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
  constructor(table: Rel<Table>, rls: RLSDO) {
    super()
    this.id = rls.id.value
    this.table = table
    this.policy = new RLSPolicy(rls.policy)
    this.subjects = rls.subjects.subjects.map((s) => s.value)
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  @Embedded(() => RLSPolicy)
  policy: RLSPolicy

  @Property({ type: JsonType })
  subjects: ISubject[]
}
