import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { RatingField } from '../rating-field.js'

export class WithRatingMax extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: RatingField, public readonly max: number) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    return this.max === this.field.max
  }
  mutate(t: Table): Result<Table, string> {
    this.field.max = this.max
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.ratingMaxEqual(this)
    return Ok(undefined)
  }
}
