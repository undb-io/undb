import * as z from 'zod'
import { recordIdSchema } from '../../record'

export const getRecordQueryInput = z.object({
  id: recordIdSchema,
})
