import type * as z from 'zod'
import type { getRecordsTreeQueryInput } from './get-records-tree.query.input.js'
import type { getRecordsTreeQueryOutput } from './get-records-tree.query.output.js'

export type IGetRecordsTreeQuery = z.infer<typeof getRecordsTreeQueryInput>
export type IGetRecordsTreeOutput = z.infer<typeof getRecordsTreeQueryOutput>
