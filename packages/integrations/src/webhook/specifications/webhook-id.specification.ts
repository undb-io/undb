import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { WebhookId } from '../webhook-id.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookId extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly webhookId: WebhookId) {
    super()
  }

  static fromString(id: string): WithWebhookId {
    return new WithWebhookId(WebhookId.from(id).unwrap())
  }

  static fromNullableString(id?: string): WithWebhookId {
    return new WithWebhookId(WebhookId.fromOrCreate(id))
  }

  static create(): WithWebhookId {
    return new WithWebhookId(WebhookId.create())
  }

  isSatisfiedBy(w: Webhook): boolean {
    return this.webhookId.equals(w.id)
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.id = this.webhookId
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}
