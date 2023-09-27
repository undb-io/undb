import { BooleanType, Entity, Index, JsonType, PrimaryKey, Property } from '@mikro-orm/core'
import { type IRootFilter } from '@undb/core'
import { Webhook as CoreWebhook } from '@undb/integrations'
import { BaseEntity } from './base.entity.js'

export const WEBHOOK_TABLE_NAME = 'undb_webhook'

@Entity({ tableName: WEBHOOK_TABLE_NAME })
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
    this.filter = webhook.filter.into()?.value
  }

  @PrimaryKey()
  id: string

  @Property()
  @Index()
  url: string

  @Property()
  @Index()
  name: string

  @Property()
  @Index()
  method: string

  @Property({ type: JsonType })
  headers: Record<string, string>

  @Property({ nullable: true })
  @Index()
  targetId?: string | null

  @Property({ nullable: true })
  targetType?: string | null

  @Property({ nullable: true })
  @Index()
  event?: string | null

  @Property({ type: BooleanType, default: false, nullable: false })
  enabled: boolean

  @Property({ type: JsonType, nullable: true })
  filter?: IRootFilter
}
