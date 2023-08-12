import type { z } from 'zod'
import type { reinviteCommandInput } from './reinvite.command.input.js'

export type IReInviteCommandInput = z.infer<typeof reinviteCommandInput>
