import type { z } from 'zod'
import type { cancelInvitationCommandInput } from './cancel-invitation.command.input.js'

export type ICancelInvitationCommandInput = z.infer<typeof cancelInvitationCommandInput>
