import type * as z from 'zod'
import type { getInvitationsQueryOutput } from './get-invitations.query.output.js'
import type { getInvitationsQuerySchema } from './get-invitations.query.schema.js'

export type IGetInvitationsQuery = z.infer<typeof getInvitationsQuerySchema>
export type IGetInvitationsOutput = z.infer<typeof getInvitationsQueryOutput>
