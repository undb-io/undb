import type { ValueObject } from '@egodb/domain'
import { isEqual } from 'date-fns'
import type { IDateFieldValue } from './date-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class DateFieldValue extends FieldValueBase<IDateFieldValue> {
  constructor(value: IDateFieldValue) {
    super({ value })
  }

  public equals(vo?: ValueObject<Date | null> | undefined): boolean {
    if (!this.props.value) return !vo?.unpack()
    if (!vo?.unpack()) return !this.props.value
    return isEqual(this.props.value, vo?.unpack() as Date)
  }

  public static now(): DateFieldValue {
    return new this(new Date())
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.date(this)
  }
}
