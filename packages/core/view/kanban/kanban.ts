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
      fieldKey: input.fieldKey ? FieldKey.from(input.fieldKey) : undefined,
    })
  }

  public get fieldKey() {
    return this.props.fieldKey
  }

  public set fieldKey(fieldKey: FieldKey | undefined) {
    this.props.fieldKey = fieldKey
  }

  public removeField(field: Field): Option<Kanban> {
    if (this.fieldKey?.equals(field.key)) {
      const kanban = new Kanban({ ...this, fieldKey: undefined })
      return Some(kanban)
    }

    return None
  }
}
