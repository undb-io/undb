import * as z from 'zod'
import { getTableQueryOutput } from './get-table.query.output'
import { getTableQuerySchema } from './get-table.query.schema'

export type IGetTableQuery = z.infer<typeof getTableQuerySchema>
export type IGetTableOutput = z.infer<typeof getTableQueryOutput>
