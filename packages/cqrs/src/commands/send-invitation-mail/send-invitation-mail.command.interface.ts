import type { z } from 'zod'
import type { sendInvitationMailCommandInput } from './send-invitation-mail.command.input.js'

export type ISendInvitationMailCommandInput = z.infer<typeof sendInvitationMailCommandInput>
