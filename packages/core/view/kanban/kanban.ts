import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { Field } from '../../field'
import { FieldKey } from '../../field'
import type { IKanbanSchema } from './kanban.schema'
import type { IKanban } from './kanban.type'

export class Kanban extends ValueObject<IKanban> {
  static from(input: IKanbanSchema) {
    return new this({
      fieldId: input.fieldId ? FieldKey.from(input.fieldId) : undefined,
    })
  }

  public get fieldId() {
    return this.props.fieldId
  }

  public set fieldId(fieldId: FieldKey | undefined) {
    this.props.fieldId = fieldId
  }

  public removeField(field: Field): Option<Kanban> {
    if (this.fieldId?.equals(field.key)) {
      const kanban = new Kanban({ ...this, fieldId: undefined })
      return Some(kanban)
    }

    return None
  }
}
