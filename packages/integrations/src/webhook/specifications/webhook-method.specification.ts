import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { WebhookMethod, webhookMethodSchema } from '../webhook-method.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookMethod extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly webhookMethod: WebhookMethod) {
    super()
  }

  static fromString(method: string): WithWebhookMethod {
    return new WithWebhookMethod(new WebhookMethod({ value: webhookMethodSchema.parse(method) }))
  }

  isSatisfiedBy(w: Webhook): boolean {
    return this.webhookMethod.equals(w.method)
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.method = this.webhookMethod
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.methodEqual(this)
    return Ok(undefined)
  }
}
