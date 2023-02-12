import { z } from 'zod'
import { DateField, SelectField } from '../../field/index.js'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const kanbanSchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export const kanbanField = z.union([z.instanceof(SelectField), z.instanceof(DateField)])

export type IKanbanField = z.infer<typeof kanbanField>

export type IKanbanSchema = z.infer<typeof kanbanSchema>
