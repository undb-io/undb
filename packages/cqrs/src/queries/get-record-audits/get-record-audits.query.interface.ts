import type * as z from 'zod'
import type { getRecordAuditsQueryInput } from './get-record-audits.query.input.js'
import type { getRecordAuditsQueryOutput } from './get-record-audits.query.output.js'

export type IGetRecordAuditsQuery = z.infer<typeof getRecordAuditsQueryInput>
export type IGetRecordAuditsOutput = z.infer<typeof getRecordAuditsQueryOutput>
