import { queryApiToken } from '@undb/openapi'
import { z } from 'zod'

export const getApiTokensQueryOutput = z.object({
  apiTokens: queryApiToken.array(),
})
