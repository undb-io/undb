import type { TFunction } from 'i18next'
import type { JsonValue } from 'type-fest'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { ICollaboratorFieldValue, ICollaboratorProfile } from './collaborator-field.type.js'

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

export const getAnonymousCollaboratorProfile = (t: TFunction): ICollaboratorProfile => ({
  username: t('anonymous', { ns: 'common' }),
  avatar: null,
  color: 'blue',
})
