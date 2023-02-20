import type * as z from 'zod'
import type { getForeignRecordsQueryInput } from './get-foreign-records.query.input.js'
import type { getForeignRecordsQueryOutput } from './get-foreign-records.query.output.js'

export type IGetForeignRecordsQuery = z.infer<typeof getForeignRecordsQueryInput>
export type IGetForeignRecordsOutput = z.infer<typeof getForeignRecordsQueryOutput>
