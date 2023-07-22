import { PrimaryKey } from '@mikro-orm/core'
import { Audit as CoreAudit } from '@undb/integrations'
import { BaseEntity } from './base.js'

export class Audit extends BaseEntity {
  constructor(audit: CoreAudit) {
    super()
    this.id = audit.id.value
  }

  @PrimaryKey()
  id: string
}
