import type * as z from 'zod'
import type { getRecordsQueryInput } from './get-records.query.input.js'
import type { getRecordsQueryOutput } from './get-records.query.output.js'

export type IGetRecordsQuery = z.infer<typeof getRecordsQueryInput>
export type IGetRecordsOutput = z.infer<typeof getRecordsQueryOutput>
