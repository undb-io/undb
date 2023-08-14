import { joinURL } from 'ufo'

export const getInvitationURL = (host: string, invitationId: string) => joinURL(host, 'invitation', invitationId)
