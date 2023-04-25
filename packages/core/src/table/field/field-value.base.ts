import { ValueObject } from '@undb/domain'
import type { JsonValue } from 'type-fest'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { UnpackedFieldValue } from './field.type.js'

export abstract class FieldValueBase<V extends UnpackedFieldValue> extends ValueObject<V> {
  abstract accept(visitor: IFieldValueVisitor): void
  abstract get json(): JsonValue
}
