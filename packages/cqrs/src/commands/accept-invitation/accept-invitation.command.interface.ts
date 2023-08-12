import type { z } from 'zod'
import type { acceptInvitationCommandInput } from './accept-invitation.command.input.js'

export type IAcceptInvitationCommandInput = z.infer<typeof acceptInvitationCommandInput>
