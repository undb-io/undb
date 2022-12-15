import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { DateFieldValue } from '../../field/date-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

export class WithRecordCreatedAt extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly date: DateFieldValue) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    return this.date.equals(t.createdAt)
  }

  /**
   * created at should not mutate exisiting record
   * @param r - record
   * @returns
   */
  mutate(r: Record): Result<Record, string> {
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdAt(this)
    return Ok(undefined)
  }
}
