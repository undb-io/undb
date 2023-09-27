import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { Base } from '../base.js'
import type { IBaseSpecVisitor } from '../interface.js'
import { BaseName } from '../value-objects/base-name.vo.js'

export class WithBaseName extends CompositeSpecification<Base, IBaseSpecVisitor> {
  constructor(public readonly name: BaseName) {
    super()
  }
  static fromString(name: string) {
    return new WithBaseName(new BaseName({ value: name }))
  }
  isSatisfiedBy(t: Base): boolean {
    return this.name.equals(t.name)
  }
  mutate(t: Base): Result<Base, string> {
    t.name = this.name
    return Ok(t)
  }
  accept(v: IBaseSpecVisitor): Result<void, string> {
    v.withName(this)
    return Ok(undefined)
  }
}
