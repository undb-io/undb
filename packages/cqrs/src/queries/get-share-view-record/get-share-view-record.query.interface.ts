import type * as z from 'zod'
import type { getShareViewRecordQueryInput } from './get-share-view-record.query.input.js'
import type { getShareViewRecordQueryOutput } from './get-share-view-record.query.output.js'

export type IGetShareViewRecordQuery = z.infer<typeof getShareViewRecordQueryInput>
export type IGetShareViewRecordOutput = z.infer<typeof getShareViewRecordQueryOutput>
