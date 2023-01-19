import { FieldValueBase } from './field-value.base'
import type { IFieldValueVisitor } from './field-value.visitor'
import type { ITreeFieldValue } from './tree-field.type'

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
