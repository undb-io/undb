import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { Field } from '../../field'
import { FieldKey } from '../../field'
import type { ICalendarSchema } from './calendar.schema'
import type { ICalendar } from './calendar.type'

export class Calendar extends ValueObject<ICalendar> {
  static from(input: ICalendarSchema) {
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

  public removeField(field: Field): Option<Calendar> {
    if (this.fieldKey?.equals(field.key)) {
      const kanban = new Calendar({ ...this, fieldKey: undefined })
      return Some(kanban)
    }

    return None
  }
}
