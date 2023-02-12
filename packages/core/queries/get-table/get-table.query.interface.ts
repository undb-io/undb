import type * as z from 'zod'
import type { getTableQueryOutput } from './get-table.query.output.js'
import type { getTableQuerySchema } from './get-table.query.schema.js'

export type IGetTableQuery = z.infer<typeof getTableQuerySchema>
export type IGetTableOutput = z.infer<typeof getTableQueryOutput>
