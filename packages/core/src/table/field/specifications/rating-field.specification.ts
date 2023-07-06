import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { RatingField } from '../fields/rating/rating-field.js'
import type { RatingFieldType } from '../fields/rating/rating-field.type.js'

export class WithRatingMax extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly type: RatingFieldType, public readonly fieldId: string, public readonly max: number) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as RatingField
    return this.max === field.max
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as RatingField
    field.max = this.max
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.ratingMaxEqual(this)
    return Ok(undefined)
  }
}
