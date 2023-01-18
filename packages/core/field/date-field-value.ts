import type { IDateFieldValue } from './date-field.type'
import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'

export class DateFieldValue extends FieldValueBase<IDateFieldValue> {
  constructor(value: IDateFieldValue) {
    super({ value })
  }

  public static now(): DateFieldValue {
    return new this(new Date())
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.date(this)
  }
}
