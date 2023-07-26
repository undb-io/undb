import { EVT_RECORD_ALL } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IWebhookTarget } from '../webhook-target.vo.js'
import { WebhookTarget } from '../webhook-target.vo.js'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'
import { WithWebhookEnabled } from './webhook-enabled.specification.js'

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

export class WithWebhookTable extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly tableId: string) {
    super()
  }

  isSatisfiedBy(w: Webhook): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(w: Webhook): Result<Webhook, string> {
    throw new Error('Method not implemented.')
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.targetTable(this)
    return Ok(undefined)
  }
}

export class WebhookEventsIn extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  // TODO: typing events
  constructor(public readonly events: string[]) {
    super()
  }

  isSatisfiedBy(t: Webhook): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Webhook): Result<Webhook, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.eventsIn(this)
    return Ok(undefined)
  }
}

export class WithWebhookEvent extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  // TODO: typing events
  constructor(public readonly event: string) {
    super()
  }

  isSatisfiedBy(t: Webhook): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Webhook): Result<Webhook, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.eventEqual(this)
    return Ok(undefined)
  }
}

export const withTableEvents = (tableId: string, events: string[]) => {
  return new WithWebhookTable(tableId)
    .and(new WebhookEventsIn([EVT_RECORD_ALL, ...events]))
    .and(WithWebhookEnabled.enabled())
}
