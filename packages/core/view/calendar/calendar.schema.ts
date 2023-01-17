import { z } from 'zod'
import { isDateField } from '../../field/date-field.type'
import { isDateRangeField } from '../../field/date-range-field.type'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'

export const calendarSchema = z.object({
  fieldId: fieldKeySchema.optional(),
})

export const calendarField = z.union([isDateField, isDateRangeField])

export type ICalendarField = z.infer<typeof calendarField>

export type ICalendarSchema = z.infer<typeof calendarSchema>
