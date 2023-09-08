import { z } from 'zod'
import { apiTokenIdSchema, apiTokenTokenSchema } from './value-objects'

export const queryApiToken = z.object({
  id: apiTokenIdSchema,
  token: apiTokenTokenSchema,
})

export type IQueryApiToken = z.infer<typeof queryApiToken>
