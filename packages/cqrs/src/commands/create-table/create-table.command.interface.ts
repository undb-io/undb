import type * as z from 'zod'
import type { createTableCommandInput } from './create-table.command.input.js'
import type { createTableCommandOutput } from './create-table.command.output.js'

export type ICreateTableInput = z.infer<typeof createTableCommandInput>
export type ICreateTableOutput = z.infer<typeof createTableCommandOutput>
