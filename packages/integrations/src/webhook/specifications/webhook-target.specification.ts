import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IWebhookTarget } from '../webhook-target.vo.js'
import { WebhookTarget } from '../webhook-target.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookTarget extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly webhookTarget: WebhookTarget | null) {
    super()
  }

  static from(target: IWebhookTarget): WithWebhookTarget {
    return new WithWebhookTarget(new WebhookTarget(target ? target : { value: null }))
  }

  isSatisfiedBy(w: Webhook): boolean {
    if (!this.webhookTarget && !w.target) return true
    if (!w.target) return false
    return this.webhookTarget?.equals(w.target) ?? false
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.target = this.webhookTarget
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.targetEqual(this)
    return Ok(undefined)
  }
}
