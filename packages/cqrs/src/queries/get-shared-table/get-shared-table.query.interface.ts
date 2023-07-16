import type * as z from 'zod'
import type { getSharedTableQueryInput } from './get-shared-table.query.input.js'
import type { getSharedTableQueryOutput } from './get-shared-table.query.output.js'

export type IGetSharedTableQuery = z.infer<typeof getSharedTableQueryInput>
export type IGetSharedTableOutput = z.infer<typeof getSharedTableQueryOutput>
