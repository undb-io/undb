import { z } from 'zod'
import type { IRatingFilter, IRatingFilterOperator } from '../filter/rating.filter.js'
import { BaseField } from './field.base.js'
import type { IRatingField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { RatingFieldValue } from './rating-field-value.js'
import type { ICreateRatingFieldInput, ICreateRatingFieldValue, RatingFieldType } from './rating-field.type.js'

export class RatingField extends BaseField<IRatingField> {
  type: RatingFieldType = 'rating'

  override get primitive() {
    return true
  }

  public get max(): number {
    return this.props.max ?? 5
  }

  static create(input: Omit<ICreateRatingFieldInput, 'type'>): RatingField {
    return new RatingField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateRatingFieldInput): RatingField {
    return new RatingField(super.unsafeCreateBase(input))
  }

  createValue(value: ICreateRatingFieldValue): RatingFieldValue {
    return new RatingFieldValue(value)
  }

  createFilter(operator: IRatingFilterOperator, value: number | null): IRatingFilter {
    return { operator, value, path: this.id.value, type: 'rating' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.rating(this)
  }

  get valueSchema() {
    const rating = z.number().nonnegative().max(this.max)
    return this.required ? rating : rating.nullable()
  }
}
