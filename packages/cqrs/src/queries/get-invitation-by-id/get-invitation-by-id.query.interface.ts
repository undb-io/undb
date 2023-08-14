import type * as z from 'zod'
import type { getInvitationByIdQueryOutput } from './get-invitation-by-id.query.output.js'
import type { getInvitationByIdQuerySchema } from './get-invitation-by-id.query.schema.js'

export type IGetInvitationByIdQuery = z.infer<typeof getInvitationByIdQuerySchema>
export type IGetInvitationByIdOutput = z.infer<typeof getInvitationByIdQueryOutput>
