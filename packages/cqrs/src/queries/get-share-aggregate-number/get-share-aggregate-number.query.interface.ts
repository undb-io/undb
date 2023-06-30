import type * as z from 'zod'
import type { getShareAggregateNumberQueryOutput } from './get-share-aggregate-number.query.output.js'
import type { getShareAggregateNumberQuerySchema } from './get-share-aggregate-number.query.schema.js'

export type IGetShareAggregateNumberQuery = z.infer<typeof getShareAggregateNumberQuerySchema>
export type IGetShareAggregateNumberOutput = z.infer<typeof getShareAggregateNumberQueryOutput>
