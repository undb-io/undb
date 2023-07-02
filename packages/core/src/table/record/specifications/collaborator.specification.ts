import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { CollaboratorFieldValue } from '../../field/fields/collaborator/collaborator-field-value.js'
import type { ICollaboratorFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class CollaboratorEqual extends BaseRecordSpecification<CollaboratorFieldValue> {
  static from(fieldId: string, value: ICollaboratorFieldValue): CollaboratorEqual {
    return new this(fieldId, new CollaboratorFieldValue(value))
  }

  static fromString(fieldId: string, value: string): CollaboratorEqual {
    return new this(fieldId, new CollaboratorFieldValue([value]))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof CollaboratorFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.collaboratorEqual(this)
    return Ok(undefined)
  }
}

export class CollaboratorIsEmpty extends BaseRecordSpecification<CollaboratorFieldValue> {
  constructor(fieldId: string) {
    super(fieldId, new CollaboratorFieldValue(null))
  }

  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof CollaboratorFieldValue && value.equals(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.collaboratorIsEmpqy(this)
    return Ok(undefined)
  }
}
