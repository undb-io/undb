import { inject } from "@undb/di"
import type { InvitationDo } from "./invitation.do"

export interface IInvitationRepository {
  insert(invitation: InvitationDo): Promise<void>
}

export const INVITATION_REPOSITORY = Symbol("IInvitationRepository")
export const injectInvitationRepository = () => inject(INVITATION_REPOSITORY)
