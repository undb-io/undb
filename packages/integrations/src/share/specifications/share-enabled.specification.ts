import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Share } from '../share.js'
import type { IShareSpecVisitor } from './interface.js'

export class WithShareEnabled extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly enabled: boolean) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    return !!s.enabled === this.enabled
  }

  mutate(w: Share): Result<Share, string> {
    w.enabled = this.enabled
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.enabled(this)
    return Ok(undefined)
  }
}
