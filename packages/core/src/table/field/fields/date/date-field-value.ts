import type { ValueObject } from '@undb/domain'
import { isEqual } from 'date-fns'
import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IDateFieldValue } from './date-field.type.js'

export class DateFieldValue extends FieldValueBase<IDateFieldValue> {
  get json(): JsonValue {
    return this.props.value?.toISOString() ?? null
  }

  constructor(value: IDateFieldValue) {
    super({ value })
  }

  static fromString(str: string): DateFieldValue {
    return new this(new Date(str))
  }

  static fromNullableString(str: string | null): DateFieldValue {
    if (!str) return new this(null)
    return new this(new Date(str))
  }

  public equals(vo?: ValueObject<Date | null> | undefined): boolean {
    if (!this.props.value) return !vo?.unpack()
    if (!vo?.unpack()) return !this.props.value
    return isEqual(this.props.value, vo?.unpack() as Date)
  }

  public static now(): DateFieldValue {
    return new this(new Date())
  }

  public toString(): string | undefined {
    return this.props.value?.toISOString()
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.date(this)
  }
}
