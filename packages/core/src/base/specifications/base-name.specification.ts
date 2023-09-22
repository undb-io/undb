import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { Base } from '../base.js'
import type { IBaseVisitor } from '../interface.js'
import type { BaseName } from '../value-objects/base-name.vo.js'

export class WithBaseName extends CompositeSpecification<Base, IBaseVisitor> {
  constructor(public readonly name: BaseName) {
    super()
  }
  isSatisfiedBy(t: Base): boolean {
    return this.name.equals(t.name)
  }
  mutate(t: Base): Result<Base, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: IBaseVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
