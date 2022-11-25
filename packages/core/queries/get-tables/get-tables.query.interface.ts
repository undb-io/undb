import type * as z from 'zod'
import type { getTablesQueryOutput } from './get-tables.query.output'
import type { getTablesQuerySchema } from './get-tables.query.schema'

export type IGetTablesQuery = z.infer<typeof getTablesQuerySchema>
export type IGetTablesOutput = z.infer<typeof getTablesQueryOutput>
