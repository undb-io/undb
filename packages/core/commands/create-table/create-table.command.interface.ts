import * as z from 'zod'
import { createTableCommandSchema } from './create-table.command.schema'

export type ICreateTableCommand = z.infer<typeof createTableCommandSchema>
