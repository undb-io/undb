import type { z } from 'zod'
import type { updateBaseCommandInput } from './update-base.command.input.js'

export type IUpdateBaseCommandInput = z.infer<typeof updateBaseCommandInput>
