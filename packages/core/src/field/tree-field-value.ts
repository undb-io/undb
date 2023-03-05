import { FieldValueBase } from './field-value.base.js'
import type { IFieldValueVisitor } from './field-value.visitor.js'
import type { ITreeFieldValue } from './tree-field.type.js'

export class TreeFieldValue extends FieldValueBase<ITreeFieldValue> {
  constructor(value: ITreeFieldValue) {
    super(value === null ? { value } : value)
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : null
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.tree(this)
  }
}
