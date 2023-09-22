import { Cascade, Entity, Index, JsonType, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core'
import { Audit as CoreAudit } from '@undb/integrations'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'
import { User } from './user.js'

@Entity({ tableName: 'undb_audit' })
export class Audit extends BaseEntity {
  constructor(audit: CoreAudit, user: Rel<User>, table?: Rel<Table>) {
    super()
    this.id = audit.id.value
    this.timestamp = audit.timestamp.value
    this.op = audit.op
    this.targetId = audit.target.id
    this.targetType = audit.target.type
    this.detail = audit.detail.into()?.unpack() ?? undefined
    this.operator = user
    this.table = table
  }

  @PrimaryKey()
  id: string

  @Index()
  @Property()
  timestamp: Date

  @Index()
  @Property()
  op: string

  @Index()
  @Property({ nullable: true })
  targetId?: string

  @Property({ nullable: true })
  targetType?: string

  @Property({ type: JsonType, nullable: true })
  detail?: object

  @ManyToOne(() => User)
  operator: Rel<User>

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table?: Rel<Table>
}
