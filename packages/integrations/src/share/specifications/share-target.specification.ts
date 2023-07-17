import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { match } from 'ts-pattern'
import { IShareType, ShareTarget } from '../share-target.vo.js'
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

export class WithShareForm extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly formId: string) {
    super()
  }

  isSatisfiedBy(s: Share): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(w: Share): Result<Share, string> {
    w.target = new ShareTarget({ type: 'form', id: this.formId })
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.targetForm(this)
    return Ok(undefined)
  }
}

export const withShare = (type: IShareType | undefined, id: string) => {
  return match(type)
    .with('view', undefined, () => new WithShareView(id))
    .with('form', () => new WithShareForm(id))
    .exhaustive()
}
