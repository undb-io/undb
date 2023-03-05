import { ValueObject } from '@egodb/domain'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { IFieldQueryValue } from './field.type.js'

export abstract class FieldValueBase<V extends IFieldQueryValue> extends ValueObject<V> {
  abstract accept(visitor: IFieldValueVisitor): void
}
