import type { z } from 'zod'
import type { deleteWidgeCommandInput } from './delete-widge.command.input.js'

export type IDeleteWidgeCommandInput = z.infer<typeof deleteWidgeCommandInput>
