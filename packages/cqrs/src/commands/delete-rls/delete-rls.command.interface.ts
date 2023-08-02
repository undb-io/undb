import type { z } from 'zod'
import type { deleteRLSCommandInput } from './delete-rls.command.input.js'

export type IDeleteRLSCommandInput = z.infer<typeof deleteRLSCommandInput>
