import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { FieldId } from '../../field/index.js'
import type { IGanttSchema } from './gantt.schema.js'
import type { IGantt } from './gantt.type.js'

export class Gantt extends ValueObject<IGantt> {
  static from(input: IGanttSchema) {
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

  public removeField(fieldId: FieldId): Option<Gantt> {
    if (this.fieldId?.equals(fieldId)) {
      const gantt = new Gantt({ ...this, fieldId: undefined })
      return Some(gantt)
    }

    return None
  }

  public toJSON() {
    return {
      fieldId: this.fieldId?.value,
    }
  }
}
