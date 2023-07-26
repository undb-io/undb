import { RootFilter, type IRootFilter } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { Webhook } from '../webhook'
import type { IWebhookSpecVisitor } from './interface'

export class WithWebhookFilter extends CompositeSpecification<Webhook, IWebhookSpecVisitor> {
  constructor(public readonly filter: IRootFilter | null) {
    super()
  }

  isSatisfiedBy(t: Webhook): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(t: Webhook): Result<Webhook, string> {
    const filter = this.filter ? Some(new RootFilter(this.filter)) : None
    t.filter = filter
    return Ok(t)
  }

  accept(v: IWebhookSpecVisitor): Result<void, string> {
    v.filterEqual(this)
    return Ok(undefined)
  }
}
