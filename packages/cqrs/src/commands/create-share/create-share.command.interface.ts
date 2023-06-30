import type { z } from 'zod'
import type { createShareCommandInput } from './create-share.command.input.js'

export type ICreateShareCommandInput = z.infer<typeof createShareCommandInput>
