import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues, Records } from '../../../record/record.type.js'
import { BaseField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { RatingFieldValue } from './rating-field-value.js'
import type {
  ICreateRatingFieldInput,
  ICreateRatingFieldValue,
  IRatingField,
  RatingFieldType,
} from './rating-field.type.js'
import type { IRatingFilter, IRatingFilterOperator } from './rating.filter.js'

export class RatingField extends BaseField<IRatingField> {
  duplicate(name: string): RatingField {
    return RatingField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: RatingFieldType = 'rating'

  override get json() {
    return {
      ...super.json,
      max: this.max,
    }
  }

  override toEvent(r: Records) {
    return {
      ...super.toEvent(r),
      max: this.max,
    }
  }

  override get primitive() {
    return true
  }

  public get max(): number {
    return this.props.max ?? 5
  }

  public set max(max: number) {
    this.props.max = max
  }

  static create(input: Omit<ICreateRatingFieldInput, 'type'>): RatingField {
    return new RatingField({ ...super.createBase(input), max: input.max })
  }

  static unsafeCreate(input: ICreateRatingFieldInput): RatingField {
    return new RatingField({ ...super.unsafeCreateBase(input), max: input.max })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value]
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
