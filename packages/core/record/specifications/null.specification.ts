import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

export class NullSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly fieldId: string) {
    super()
  }

  isSatisfiedBy(r: Record): boolean {
    return r.values.getUnpackedValue(this.fieldId).mapOr(false, (value) => value === null)
  }

  mutate(t: Record): Result<Record, string> {
    throw new Error('Method not implemented.')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.null(this)
    return Ok(undefined)
  }
}
