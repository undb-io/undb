import type * as z from 'zod'
import type { getTreeAvailableRecordsQueryInput } from './get-tree-available-records.query.input'
import type { getTreeAvailableRecordsQueryOutput } from './get-tree-available-records.query.output'

export type IGetTreeAvailableRecordsQuery = z.infer<typeof getTreeAvailableRecordsQueryInput>
export type IGetTreeAvailableRecordsOutput = z.infer<typeof getTreeAvailableRecordsQueryOutput>
