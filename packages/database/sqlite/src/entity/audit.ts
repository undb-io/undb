import { PrimaryKey, Property } from '@mikro-orm/core'
import { Audit as CoreAudit } from '@undb/integrations'
import { BaseEntity } from './base.js'

export class Audit extends BaseEntity {
  constructor(audit: CoreAudit) {
    super()
    this.id = audit.id.value
    this.timestamp = audit.timestamp.value
    this.op = audit.op
  }

  @PrimaryKey()
  id: string

  @Property()
  timestamp: Date

  @Property()
  op: string
}
