import type { z } from 'zod'
import type { updateFormCommandInput } from './update-form.command.input.js'

export type IUpdateFormCommandInput = z.infer<typeof updateFormCommandInput>
