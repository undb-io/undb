import { z } from 'zod'
import { baseIdSchema } from './value-objects'

export const queryBase = z.object({
  id: baseIdSchema,
})

export type IQueryBase = z.infer<typeof queryBase>
