import * as z from 'zod'
import { createTableCommandInput } from './create-table.command.input'
import { createTableCommandOutput } from './create-table.command.output'

export type ICreateTableInput = z.infer<typeof createTableCommandInput>
export type ICreateTableOutput = z.infer<typeof createTableCommandOutput>
