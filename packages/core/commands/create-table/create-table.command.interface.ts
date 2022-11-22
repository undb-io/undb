import * as z from 'zod'
import { createTableCommandOutput } from './create-table.command.output'
import { createTableCommandSchema } from './create-table.command.schema'

export type ICreateTableCommand = z.infer<typeof createTableCommandSchema>
export type ICreateTableOutput = z.infer<typeof createTableCommandOutput>
