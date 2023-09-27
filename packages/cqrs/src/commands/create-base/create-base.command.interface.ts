import type { z } from 'zod'
import type { createBaseCommandInput } from './create-base.command.input.js'

export type ICreateBaseCommandInput = z.infer<typeof createBaseCommandInput>
