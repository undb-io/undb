import type * as z from 'zod'
import type { getTreeAvailableRecordsQueryInput } from './get-tree-available-records.query.input.js'
import type { getTreeAvailableRecordsQueryOutput } from './get-tree-available-records.query.output.js'

export type IGetTreeAvailableRecordsQuery = z.infer<typeof getTreeAvailableRecordsQueryInput>
export type IGetTreeAvailableRecordsOutput = z.infer<typeof getTreeAvailableRecordsQueryOutput>
