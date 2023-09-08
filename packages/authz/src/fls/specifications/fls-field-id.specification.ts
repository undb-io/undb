import { FieldId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FLS } from '../fls.js'
import type { IFLSVisitor } from '../interface.js'

export class WithFLSFieldId extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly fieldId: FieldId) {
    super()
  }
  static fromString(fieldId: string): WithFLSFieldId {
    return new this(FieldId.fromString(fieldId))
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.fieldId.equals(this.fieldId)
  }
  mutate(t: FLS): Result<FLS, string> {
    t.fieldId = this.fieldId
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withFieldId(this)
    return Ok(undefined)
  }
}
