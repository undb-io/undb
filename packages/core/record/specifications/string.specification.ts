import { CompositeSpecification } from '@egodb/domain/dist'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordSpecVisitor } from './interface'

export class StringEqual extends CompositeSpecification<Record, IRecordSpecVisitor> {
  constructor(readonly name: string, readonly value: string) {
    super()
  }

  /**
   * check given string is equal to record value
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getStringValue(this.name).mapOr(false, (value) => value === this.value)
  }

  mutate(): Result<Record, string> {
    throw new Error('Method [StringEqual.mutate] not implemented.')
  }

  accept(v: IRecordSpecVisitor): Result<void, string> {
    v.valueStringEqual(this)
    return Ok(undefined)
  }
}
