import type * as z from 'zod'
import type { getRecordsTreeQueryInput } from './get-records-tree.query.input'
import type { getRecordsTreeQueryOutput } from './get-records-tree.query.output'

export type IGetRecordsTreeQuery = z.infer<typeof getRecordsTreeQueryInput>
export type IGetRecordsTreeOutput = z.infer<typeof getRecordsTreeQueryOutput>
