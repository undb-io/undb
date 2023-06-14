import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Webhook } from '../webhook.js'
import type { IWebhookSpecVisitor } from './interface.js'

export class WithWebhookName extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly name: string) {
    super()
  }

  isSatisfiedBy(w: Webhook): boolean {
    return this.name === w.name
  }

  mutate(w: Webhook): Result<Webhook, string> {
    w.name = this.name
    return Ok(w)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.nameEqual(this)
    return Ok(undefined)
  }
}
