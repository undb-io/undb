import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ILookupFieldValue } from './lookup-field.type.js'

export class LookupFieldValue extends FieldValueBase<ILookupFieldValue> {
  get json(): JsonValue {
    return Array.isArray(this.props) ? this.props : this.props.value
  }
  constructor(value: ILookupFieldValue) {
    super(value ? value : { value: null })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.lookup(this)
  }
}
