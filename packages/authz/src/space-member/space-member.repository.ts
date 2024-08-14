import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import type { ISpaceMemberDTO } from "./dto"
import { SpaceMember } from "./space-member"
import type { SpaceMemberComositeSpecification } from "./space-member.composite-specification"

export interface ISpaceMemberRepository {
  findOneById(id: string): Promise<SpaceMember>
  findOne(spec: SpaceMemberComositeSpecification): Promise<Option<SpaceMember>>

  insert(member: SpaceMember): Promise<void>
  exists(spec: SpaceMemberComositeSpecification): Promise<boolean>
}

export const SPACE_MEMBER_REPOSITORY = Symbol("ISpaceMemberRepository")
export const injectSpaceMemberRepository = () => inject(SPACE_MEMBER_REPOSITORY)

export interface ISpaceMemberQueryRepository {
  findOneById(id: string): Promise<Option<ISpaceMemberDTO>>
  findOne(spec: SpaceMemberComositeSpecification): Promise<Option<ISpaceMemberDTO>>
  findByIds(ids: [string, ...string[]]): Promise<ISpaceMemberDTO[]>
  find(spec: Option<SpaceMemberComositeSpecification>): Promise<ISpaceMemberDTO[]>
}

export const WORKSPQACE_MEMBER_QUERY_REPOSITORY = Symbol("ISpaceMemberQueryRepository")

export const injectSpaceMemberQueryRepository = () => inject(WORKSPQACE_MEMBER_QUERY_REPOSITORY)
