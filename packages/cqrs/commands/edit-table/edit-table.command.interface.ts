import type { z } from 'zod'
import type { editTableCommandInput } from './edit-table.command.input.js'

export type IEditTableCommandInput = z.infer<typeof editTableCommandInput>
