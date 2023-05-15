import type { z } from 'zod'
import type { createWidgeCommandInput } from './create-widge.command.input.js'

export type ICreateWidgeCommandInput = z.infer<typeof createWidgeCommandInput>
