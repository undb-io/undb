import { inject } from "@undb/di"
import type { Option } from "@undb/domain"
import type { InvitationDTO } from "./dto"
import type { InvitationDo } from "./invitation.do"
import type { InvitationCompositeSpecification } from "./invitation.specification"

export interface IInvitationRepository {
  insert(invitation: InvitationDo): Promise<void>
  upsert(invitation: InvitationDo): Promise<void>
  updateOneById(id: string, spec: InvitationCompositeSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export interface IInvitationQueryRepository {
  find(spec: Option<InvitationCompositeSpecification>): Promise<InvitationDTO[]>
  findOneById(id: string): Promise<Option<InvitationDTO>>
  findOne(spec: InvitationCompositeSpecification): Promise<Option<InvitationDTO>>
}

export const INVITATION_REPOSITORY = Symbol("IInvitationRepository")
export const injectInvitationRepository = () => inject(INVITATION_REPOSITORY)

export const INVITATION_QUERY_REPOSITORY = Symbol("IInvitationQueryRepository")
export const injectInvitationQueryRepository = () => inject(INVITATION_QUERY_REPOSITORY)
