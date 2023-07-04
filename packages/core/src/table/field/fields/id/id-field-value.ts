import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IIdFieldValue } from './id-field.type.js'

export class IdFieldValue extends FieldValueBase<IIdFieldValue> {
  get json() {
    return this.props.value
  }

  constructor(value: IIdFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.id(this)
  }
}
