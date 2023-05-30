import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { FieldId } from '../../field/index.js'
import type { IKanbanSchema } from './kanban.schema.js'
import type { IKanban } from './kanban.type.js'

export class Kanban extends ValueObject<IKanban> {
  static from(input: IKanbanSchema) {
    return new this({
      fieldId: input.fieldId ? FieldId.fromString(input.fieldId) : undefined,
    })
  }

  public get fieldId() {
    return this.props.fieldId
  }

  public set fieldId(fieldId: FieldId | undefined) {
    this.props.fieldId = fieldId
  }

  public removeField(fieldId: FieldId): Option<Kanban> {
    if (this.fieldId?.equals(fieldId)) {
      const kanban = new Kanban({ ...this, fieldId: undefined })
      return Some(kanban)
    }

    return None
  }

  public toJSON() {
    return {
      fieldId: this.fieldId?.value,
    }
  }
}
