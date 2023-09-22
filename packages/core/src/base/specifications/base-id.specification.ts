import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { Base } from '../base.js'
import type { IBaseVisitor } from '../interface'
import type { BaseId } from '../value-objects/base-id.vo.js'

export class WithBaseId extends CompositeSpecification<Base, IBaseVisitor> {
  constructor(public readonly id: BaseId) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Base): Result<Base, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IBaseVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
