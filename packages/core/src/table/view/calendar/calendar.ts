import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { Field } from '../../field/index.js'
import { FieldId } from '../../field/index.js'
import type { ICalendarSchema } from './calendar.schema.js'
import type { ICalendar } from './calendar.type.js'

export class Calendar extends ValueObject<ICalendar> {
  static from(input: ICalendarSchema) {
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

  public removeField(field: Field): Option<Calendar> {
    if (this.fieldId?.equals(field.id)) {
      const calendar = new Calendar({ ...this, fieldId: undefined })
      return Some(calendar)
    }

    return None
  }

  public toJSON() {
    return {
      fieldId: this.fieldId?.value,
    }
  }
}
