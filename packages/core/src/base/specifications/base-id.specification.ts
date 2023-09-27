import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { Base } from '../base.js'
import type { IBaseSpecVisitor } from '../interface'
import { BaseId } from '../value-objects/base-id.vo.js'

export class WithBaseId extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(public readonly id: BaseId) {
    super()
  }
  static fromString(id: string) {
    return new WithBaseId(BaseId.from(id))
  }
  isSatisfiedBy(t: Base): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Base): Result<Base, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
