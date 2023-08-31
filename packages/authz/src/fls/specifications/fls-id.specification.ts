import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FLS } from '../fls.js'
import type { IFLSVisitor } from '../interface.js'
import { FLSID } from '../value-objects/fls-id.vo.js'

export class WithFLSId extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly id: FLSID) {
    super()
  }
  static fromString(id: string): WithFLSId {
    return new this(FLSID.from(id))
  }
  static create(): WithFLSId {
    return new this(FLSID.create())
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: FLS): Result<FLS, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
