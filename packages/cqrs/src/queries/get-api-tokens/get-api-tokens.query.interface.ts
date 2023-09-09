import type * as z from 'zod'
import type { getApiTokensQueryOutput } from './get-api-tokens.query.output.js'
import type { getApiTokensQuerySchema } from './get-api-tokens.query.schema.js'

export type IGetApiTokensQuery = z.infer<typeof getApiTokensQuerySchema>
export type IGetApiTokensOutput = z.infer<typeof getApiTokensQueryOutput>
