import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { WebhookHeaders, webhookHeadersSchema } from '../webhook-headers.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookHeaders extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly webhookHeaders: WebhookHeaders) {
    super()
  }

  static from(headers: Record<string, string>): WithWebhookHeaders {
    return new WithWebhookHeaders(new WebhookHeaders(webhookHeadersSchema.parse(headers)))
  }

  isSatisfiedBy(w: Webhook): boolean {
    return this.webhookHeaders.equals(w.headers)
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.headers = this.webhookHeaders
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.headersEqual(this)
    return Ok(undefined)
  }
}
