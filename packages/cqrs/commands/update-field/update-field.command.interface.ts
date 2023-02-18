import type { z } from 'zod'
import type { updateFieldCommandInput } from './update-field.command.input.js'

export type IUpdateFieldCommandInput = z.infer<typeof updateFieldCommandInput>
