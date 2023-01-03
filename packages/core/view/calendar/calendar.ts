import { ValueObject } from '@egodb/domain'
import { FieldId } from '../../field'
import type { ICalendarSchema } from './calendar.schema'
import type { ICalendar } from './calendar.type'

export class Calendar extends ValueObject<ICalendar> {
  static from(input: ICalendarSchema) {
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
