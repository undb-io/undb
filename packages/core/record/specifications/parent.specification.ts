import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordQuerySpecification } from './record-specification.base.js'

export class ParentAvailableSpec extends BaseRecordQuerySpecification<string | undefined> {
  isSatisfiedBy(t: Record): boolean {
    throw new Error('Method not implemented.')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.parentAvailable(this)
    return Ok(undefined)
  }
}
