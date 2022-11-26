import type * as z from 'zod'
import type { createTableCommandInput } from './create-table.command.input'
import type { createTableCommandOutput } from './create-table.command.output'

export type ICreateTableInput = z.infer<typeof createTableCommandInput>
export type ICreateTableOutput = z.infer<typeof createTableCommandOutput>
