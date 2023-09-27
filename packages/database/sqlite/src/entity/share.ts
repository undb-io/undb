import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import type { Share as CoreShare } from '@undb/integrations'
import { BaseEntity } from './base.entity.js'

export const SHARE_TABLE_NAME = 'undb_share'

@Entity({ tableName: SHARE_TABLE_NAME })
export class Share extends BaseEntity {
  constructor(share: CoreShare) {
    super()
    this.id = share.id.value
    this.targetId = share.target?.id
    this.targetType = share.target?.type
    this.enabled = share.enabled
  }

  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  @Index()
  @Unique()
  targetId?: string | null

  @Property({ nullable: true })
  targetType?: string | null

  @Property({ default: false })
  enabled: boolean
}
