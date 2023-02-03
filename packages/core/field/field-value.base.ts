import { ValueObject } from '@egodb/domain'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { IFieldQueryValue } from './field.type'

export abstract class FieldValueBase<V extends IFieldQueryValue> extends ValueObject<V> {
  abstract accept(visitor: IFieldValueVisitor): void
}
