import type { z } from 'zod'
import type { inviteCommandInput } from './invite.command.input.js'

export type IInviteCommandInput = z.infer<typeof inviteCommandInput>
