import type * as z from 'zod'
import type { getShareViewTreeRecordsQueryInput } from './get-share-view-tree-records.query.input.js'
import type { getShareViewTreeRecordsQueryOutput } from './get-share-view-tree-records.query.output.js'

export type IGetShareViewTreeRecordsQuery = z.infer<typeof getShareViewTreeRecordsQueryInput>
export type IGetShareViewTreeRecordsOutput = z.infer<typeof getShareViewTreeRecordsQueryOutput>
