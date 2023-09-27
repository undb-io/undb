import type { z } from 'zod'
import type { deleteBaseCommandInput } from './delete-base.command.input.js'

export type IDeleteBaseCommandInput = z.infer<typeof deleteBaseCommandInput>
