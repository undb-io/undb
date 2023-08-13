import type { z } from 'zod'
import type { createRLSCommandInput } from './create-rls.command.input.js'

export type ICreateRLSCommandInput = z.infer<typeof createRLSCommandInput>
