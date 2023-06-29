import type * as z from 'zod'
import type { getShareViewRecordsQueryInput } from './get-share-view-records.query.input.js'
import type { getShareViewRecordsQueryOutput } from './get-share-view-records.query.output.js'

export type IGetShareViewRecordsQuery = z.infer<typeof getShareViewRecordsQueryInput>
export type IGetShareViewRecordsOutput = z.infer<typeof getShareViewRecordsQueryOutput>
