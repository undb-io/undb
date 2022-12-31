import { z } from 'zod'
import { fieldIdSchema } from '../field'

export const kanbanSchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export type IKanbanSchema = z.infer<typeof kanbanSchema>
