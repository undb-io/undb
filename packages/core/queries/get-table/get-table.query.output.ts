import * as z from 'zod'
import { queryColumnsSchema } from '../../column'

export const getTableQueryOutput = z.object({
  id: z.string(),
  name: z.string(),
  columns: queryColumnsSchema,
})
