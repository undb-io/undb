import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IUpdatedAtFieldQueryValue, IUpdatedAtFieldValue } from './updated-at-field.type.js'

export class UpdatedAtFieldValue extends FieldValueBase<IUpdatedAtFieldValue> {
  get json(): JsonValue {
    return this.props.value.toISOString()
  }
  constructor(value: IUpdatedAtFieldValue) {
    super({ value })
  }

  static fromQuery(str: IUpdatedAtFieldQueryValue): UpdatedAtFieldValue {
    return new this(new Date(str))
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.updatedAt(this)
  }
}
