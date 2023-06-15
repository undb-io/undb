import { BooleanType, Entity, JsonType, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import type { Webhook as CoreWebhook } from '@undb/integrations'
import { BaseEntity } from './base.js'

export const WEBHOOK_TABLE_NAME = 'undb_webhook'

@Entity({ tableName: WEBHOOK_TABLE_NAME })
@Unique({ properties: ['url', 'event', 'targetId', 'method'] })
export class Webhook extends BaseEntity {
  constructor(webhook: CoreWebhook) {
    super()
    this.id = webhook.id.value
    this.url = webhook.url.unpack()
    this.name = webhook.name
    this.method = webhook.method.unpack()
    this.targetId = webhook.target?.id
    this.targetType = webhook.target?.type
    this.event = webhook.target?.event ?? null
    this.enabled = webhook.enabled
    this.headers = webhook.headers.unpack()
  }

  @PrimaryKey()
  id: string

  @Property()
  url: string

  @Property()
  name: string

  @Property()
  method: string

  @Property({ type: JsonType })
  headers: Record<string, string>

  @Property({ nullable: true })
  targetId?: string | null

  @Property({ nullable: true })
  targetType?: string | null

  @Property({ nullable: true })
  event?: string | null

  @Property({ type: BooleanType, default: false, nullable: false })
  enabled: boolean
}
