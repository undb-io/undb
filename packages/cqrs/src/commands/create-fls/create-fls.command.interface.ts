import type { z } from 'zod'
import type { createFLSCommandInput } from './create-fls.command.input.js'

export type ICreateFLSCommandInput = z.infer<typeof createFLSCommandInput>
