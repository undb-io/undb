import type { z } from 'zod'
import type { setSortsCommandInput } from './set-sorts.command.input'

export type ISetSortsCommandInput = z.infer<typeof setSortsCommandInput>
