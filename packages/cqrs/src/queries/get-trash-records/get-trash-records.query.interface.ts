import type * as z from 'zod'
import type { getTrashRecordsQueryInput } from './get-trash-records.query.input.js'
import type { getTrashRecordsQueryOutput } from './get-trash-records.query.output.js'

export type IGetTrashRecordsQuery = z.infer<typeof getTrashRecordsQueryInput>
export type IGetTrashRecordsOutput = z.infer<typeof getTrashRecordsQueryOutput>
