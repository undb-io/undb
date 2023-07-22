import { Entity, Index, JsonType, PrimaryKey, Property } from '@mikro-orm/core'
import { Audit as CoreAudit } from '@undb/integrations'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'undb_audit' })
export class Audit extends BaseEntity {
  constructor(audit: CoreAudit) {
    super()
    this.id = audit.id.value
    this.timestamp = audit.timestamp.value
    this.op = audit.op
    this.targetId = audit.target.id
    this.targetType = audit.target.type
    this.detail = audit.detail.into()?.unpack() ?? undefined
    this.operatorId = audit.operatorId
  }

  @PrimaryKey()
  id: string

  @Index()
  @Property()
  timestamp: Date

  @Property()
  op: string

  @Index()
  @Property({ nullable: true })
  targetId?: string

  @Property({ nullable: true })
  targetType?: string

  @Property({ type: JsonType, nullable: true })
  detail?: object

  @Property()
  operatorId: string
}
