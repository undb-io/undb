import type * as z from 'zod'
import type { getRecordQueryInput } from './get-record.query.input.js'
import type { getRecordQueryOutput } from './get-record.query.output.js'

export type IGetRecordQuery = z.infer<typeof getRecordQueryInput>
export type IGetRecordOutput = z.infer<typeof getRecordQueryOutput>
