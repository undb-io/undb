import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { IUrlFieldValue } from './url-field.type.js'

export class UrlFieldValue extends FieldValueBase<IUrlFieldValue> {
  get json(): JsonValue {
    return this.props.value
  }
  constructor(value: IUrlFieldValue) {
    super({ value })
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.url(this)
  }
}
