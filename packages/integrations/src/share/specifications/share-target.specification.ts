import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { ShareTarget } from '../share-target.vo.js'
import type { Share } from '../share.js'
import type { IShareSpecVisitor } from './interface'

export class WithShareView extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly viewId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: 'view', id: this.viewId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetView(this)
    return Ok(undefined)
  }
}
