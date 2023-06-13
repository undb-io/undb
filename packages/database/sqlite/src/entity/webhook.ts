import { ArrayType, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import type { Webhook as CoreWebhook } from '@undb/integrations'
import { BaseEntity } from './base.js'

export const WEBHOOK_TABLE_NAME = 'undb_webhook'

@Entity({ tableName: WEBHOOK_TABLE_NAME })
export class Webhook extends BaseEntity {
  constructor(webhook: CoreWebhook) {
    super()
    this.id = webhook.id.value
    this.url = webhook.url.unpack()
    this.targetId = webhook.target?.id
    this.targetType = webhook.target?.type
    this.events = webhook.target?.events ?? null
  }

  @PrimaryKey()
  id: string

  @Property()
  url: string

  @Property({ nullable: true })
  targetId?: string | null

  @Property({ nullable: true })
  targetType?: string | null

  @Property({ type: ArrayType })
  events?: string[] | null
}
