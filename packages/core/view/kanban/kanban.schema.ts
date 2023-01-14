import { z } from 'zod'
import { DateField, SelectField } from '../../field'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'

export const kanbanSchema = z.object({
  fieldKey: fieldKeySchema.optional(),
})

export const kanbanField = z.union([z.instanceof(SelectField), z.instanceof(DateField)])

export type IKanbanField = z.infer<typeof kanbanField>

export type IKanbanSchema = z.infer<typeof kanbanSchema>
