import { z } from 'zod'
import { fieldIdSchema } from '../field'

export const kanbanSchema = z.object({
  selectField: fieldIdSchema,
})
