import type { z } from 'zod'
import type { editTableCommandInput } from './edit-table.command.input'

export type IEditTableCommandInput = z.infer<typeof editTableCommandInput>
