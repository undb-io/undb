import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IUpdatedByFieldQueryValue, IUpdatedByFieldValue } from './updated-by-field.type.js'

export class UpdatedByFieldValue extends FieldValueBase<IUpdatedByFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IUpdatedByFieldValue) {
    super({ value })
  }

  static fromQuery(str: IUpdatedByFieldQueryValue): UpdatedByFieldValue {
    return new this(str)
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.updatedBy(this)
  }
}
