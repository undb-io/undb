import type { z } from 'zod'
import type { moveFieldCommandInput } from './move-field.command.input.js'

export type IMoveFieldCommandInput = z.infer<typeof moveFieldCommandInput>
