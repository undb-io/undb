import type { z } from 'zod'
import type { updateRLSCommandInput } from './update-rls.command.input.js'

export type IUpdateRLSCommandInput = z.infer<typeof updateRLSCommandInput>
