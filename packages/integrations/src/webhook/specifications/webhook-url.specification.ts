import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { WebhookURL, webhookURLSchema } from '../webhook-url.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookURL extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly webhookURL: WebhookURL) {
    super()
  }

  static fromString(url: string): WithWebhookURL {
    return new WithWebhookURL(new WebhookURL({ value: webhookURLSchema.parse(url) }))
  }

  isSatisfiedBy(w: Webhook): boolean {
    return this.webhookURL.equals(w.id)
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.url = this.webhookURL
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.urlEqual(this)
    return Ok(undefined)
  }
}
