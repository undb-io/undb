import { z } from 'zod'
import { isDateRangeField } from '../../field/fields/date-range/date-range-field.type.js'
import { isDateField } from '../../field/fields/date/date-field.type.js'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const calendarSchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export const calendarField = z.union([isDateField, isDateRangeField])

export type ICalendarField = z.infer<typeof calendarField>

export type ICalendarSchema = z.infer<typeof calendarSchema>
