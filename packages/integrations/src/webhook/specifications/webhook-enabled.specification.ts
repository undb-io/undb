import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookEnabled extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly enabled: boolean) {
    super()
  }

  static enabled(): WithWebhookEnabled {
    return new WithWebhookEnabled(true)
  }

  isSatisfiedBy(t: Webhook): boolean {
    return this.enabled === t.enabled
  }
  mutate(t: Webhook): Result<Webhook, string> {
    t.enabled = this.enabled
    return Ok(t)
  }
  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.enabled(this)
    return Ok(undefined)
  }
}
