import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { BaseRecordQuerySpecification } from './record-specification.base'

export class TreeAvailableSpec extends BaseRecordQuerySpecification<string | undefined> {
  isSatisfiedBy(t: Record): boolean {
    throw new Error('Method not implemented.')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.treeAvailable(this)
    return Ok(undefined)
  }
}

export class IsRoot extends BaseRecordQuerySpecification<void> {
  isSatisfiedBy(t: Record): boolean {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.isRoot(this)
    return Ok(undefined)
  }
}
