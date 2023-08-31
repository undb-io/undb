import type { z } from 'zod'
import type { deleteFLSCommandInput } from './delete-fls.command.input.js'

export type IDeleteFLSCommandInput = z.infer<typeof deleteFLSCommandInput>
