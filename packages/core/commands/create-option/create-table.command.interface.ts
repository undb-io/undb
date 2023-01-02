import type * as z from 'zod'
import type { createOptionCommandInput } from './create-table.command.input'

export type ICreateOptionCommandInput = z.infer<typeof createOptionCommandInput>
