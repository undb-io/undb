import { ValueObject } from '@egodb/domain'
import { FieldId } from '../../field'
import type { IKanbanSchema } from './kanban.schema'
import type { IKanban } from './kanban.type'

export class Kanban extends ValueObject<IKanban> {
  static from(input: IKanbanSchema) {
    return new this({
      fieldId: input.fieldId ? FieldId.from(input.fieldId) : undefined,
    })
  }

  public get fieldId() {
    return this.props.fieldId
  }

  public set fieldId(fieldId: FieldId | undefined) {
    this.props.fieldId = fieldId
  }
}
