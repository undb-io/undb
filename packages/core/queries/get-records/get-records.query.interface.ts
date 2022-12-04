import type * as z from 'zod'
import type { getRecordsQueryInput } from './get-records.query.input'
import type { getRecordsQueryOutput } from './get-records.query.output'

export type IGetRecordsQuery = z.infer<typeof getRecordsQueryInput>
export type IGetRecordsOutput = z.infer<typeof getRecordsQueryOutput>

export type QueryRecords = IGetRecordsOutput['records']
