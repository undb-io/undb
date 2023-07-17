import type { z } from 'zod'
import type { createFormCommandInput } from './create-form.command.input.js'

export type ICreateFormCommandInput = z.infer<typeof createFormCommandInput>
