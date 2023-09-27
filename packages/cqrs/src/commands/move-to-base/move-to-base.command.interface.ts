import type { z } from 'zod'
import type { moveToBaseCommandInput } from './move-to-base.command.input.js'

export type IMoveToBaseCommandInput = z.infer<typeof moveToBaseCommandInput>
