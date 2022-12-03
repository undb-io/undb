import * as z from 'zod'
import { querySchemaSchema } from '../../field'

export const getTableQueryOutput = z
  .object({
    id: z.string(),
    name: z.string(),
    schema: querySchemaSchema,
  })
  .optional()
