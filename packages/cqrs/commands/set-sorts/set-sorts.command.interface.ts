import type { z } from 'zod'
import type { setSortsCommandInput } from './set-sorts.command.input.js'

export type ISetSortsCommandInput = z.infer<typeof setSortsCommandInput>
