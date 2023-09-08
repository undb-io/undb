import { z } from 'zod'
import { apiTokenIdSchema } from './value-objects'

export const queryApiToken = z.object({
  id: apiTokenIdSchema,
})

export type IQueryApiToken = z.infer<typeof queryApiToken>
