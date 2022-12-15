import type * as z from 'zod'
import type { getRecordQueryInput } from './get-record.query.input'
import type { getRecordQueryOutput } from './get-record.query.output'

export type IGetRecordQuery = z.infer<typeof getRecordQueryInput>
export type IGetRecordOutput = z.infer<typeof getRecordQueryOutput>
