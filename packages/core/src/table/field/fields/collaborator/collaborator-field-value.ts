import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICollaboratorFieldValue } from './collaborator-field.type.js'

export class CollaboratorFieldValue extends FieldValueBase<ICollaboratorFieldValue> {
  get json(): JsonValue {
    return this.unpack()
  }
  constructor(value: ICollaboratorFieldValue) {
    super(value === null ? { value } : value)
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : null
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.collaborator(this)
  }
}
