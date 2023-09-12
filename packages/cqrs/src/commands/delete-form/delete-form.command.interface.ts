import type { z } from 'zod'
import type { deleteFormCommandInput } from './delete-form.command.input.js'

export type IDeleteFormCommandInput = z.infer<typeof deleteFormCommandInput>
