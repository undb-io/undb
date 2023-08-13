import type * as z from 'zod'
import type { getTableRLSSQueryInput } from './get-table-rlss.query.input.js'
import type { getTableRLSSQueryOutput } from './get-table-rlss.query.output.js'

export type IGetTableRLSSQuery = z.infer<typeof getTableRLSSQueryInput>
export type IGetTableRLSSOutput = z.infer<typeof getTableRLSSQueryOutput>
