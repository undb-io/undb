import { inject } from "@undb/di"
import type { InvitationDTO } from "./dto"
import type { InvitationDo } from "./invitation.do"

export interface IInvitationRepository {
  insert(invitation: InvitationDo): Promise<void>
}

export interface IInvitationQueryRepository {
  find(): Promise<InvitationDTO[]>
}

export const INVITATION_REPOSITORY = Symbol("IInvitationRepository")
export const injectInvitationRepository = () => inject(INVITATION_REPOSITORY)

export const INVITATION_QUERY_REPOSITORY = Symbol("IInvitationQueryRepository")
export const injectInvitationQueryRepository = () => inject(INVITATION_QUERY_REPOSITORY)
