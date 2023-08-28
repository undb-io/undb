import type { z } from 'zod'
import type { updateFLSCommandInput } from './update-fls.command.input.js'

export type IUpdateFLSCommandInput = z.infer<typeof updateFLSCommandInput>
