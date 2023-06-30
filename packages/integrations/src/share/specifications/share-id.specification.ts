import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { ShareId } from '../share-id.vo.js'
import type { Share } from '../share.js'
import type { IShareSpecVisitor } from './interface.js'

export class WithShareId extends CompositeSpecification<Share, IShareSpecVisitor> {
  constructor(public readonly shareId: ShareId) {
    super()
  }

  static fromString(id: string): WithShareId {
    return new WithShareId(ShareId.from(id).unwrap())
  }

  static fromNullableString(id?: string): WithShareId {
    return new WithShareId(ShareId.fromOrCreate(id))
  }

  static create(): WithShareId {
    return new WithShareId(ShareId.create())
  }

  isSatisfiedBy(w: Share): boolean {
    return this.shareId.equals(w.id)
  }

  mutate(w: Share): Result<Share, string> {
    w.id = this.shareId
    return Ok(w)
  }

  accept(v: IShareSpecVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}
