import { z } from 'zod'
import { DateRangeField } from '../../field/index.js'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const ganttSchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export const ganttField = z.instanceof(DateRangeField)

export type IGanttField = z.infer<typeof ganttField>

export type IGanttSchema = z.infer<typeof ganttSchema>
