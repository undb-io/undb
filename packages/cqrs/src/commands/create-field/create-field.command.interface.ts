import type { z } from 'zod'
import type { createFieldCommandInput } from './create-field.command.input.js'

export type ICreateFieldCommandInput = z.infer<typeof createFieldCommandInput>
