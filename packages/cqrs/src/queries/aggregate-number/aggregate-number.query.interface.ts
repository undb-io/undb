import type * as z from 'zod'
import type { aggregateNumberQueryOutput } from './aggregate-number.query.output.js'
import type { aggregateNumberQuerySchema } from './aggregate-number.query.schema.js'

export type IAggregateNumberQuery = z.infer<typeof aggregateNumberQuerySchema>
export type IAggregateNumberOutput = z.infer<typeof aggregateNumberQueryOutput>
