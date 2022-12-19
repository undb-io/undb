import type { z } from 'zod'
import type { moveFieldCommandInput } from './move-field.command.input'

export type IMoveFieldCommandInput = z.infer<typeof moveFieldCommandInput>
