import { NestGetInvitationByIdQueryHandler } from './get-invitation-by-id.query.handler.js'
import { NestGetInvitationsQueryHandler } from './get-invitations.query.handler.js'

export const queries = [NestGetInvitationsQueryHandler, NestGetInvitationByIdQueryHandler]
