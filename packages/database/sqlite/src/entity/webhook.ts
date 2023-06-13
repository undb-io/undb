import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import type { Webhook as CoreWebhook } from '@undb/integrations'
import { BaseEntity } from './base.js'

export const WEBHOOK_TABLE_NAME = 'undb_webhook'

@Entity({ tableName: WEBHOOK_TABLE_NAME })
export class Webhook extends BaseEntity {
  constructor(webhook: CoreWebhook) {
    super()
    this.id = webhook.id.value
    this.url = webhook.url.unpack()
  }

  @PrimaryKey()
  id: string

  @Property()
  url: string
}
