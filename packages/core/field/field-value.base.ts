import { ValueObject } from '@egodb/domain'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IFieldValue } from './field.type'

export abstract class FieldValueBase<V extends IFieldValue> extends ValueObject<V> {
  abstract accept(visitor: IFieldValueVisitor): void
}
