import type * as z from 'zod'
import type { getParentAvailableRecordsQueryInput } from './get-parent-available-records.query.input'
import type { getParentAvailableRecordsQueryOutput } from './get-parent-available-records.query.output'

export type IGetParentAvailableRecordQuery = z.infer<typeof getParentAvailableRecordsQueryInput>
export type IGetParentAvailableRecordsOutput = z.infer<typeof getParentAvailableRecordsQueryOutput>
