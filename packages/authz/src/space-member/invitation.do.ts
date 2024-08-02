import { AggregateRoot, IdFactory } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { z } from "@undb/zod"
import type { InvitationDTO, InviteDTO } from "./dto"
import type { ISpaceMemberWithoutOwner } from "./space-member"

const prefix = "ivt"
const size = 10

export const invitationId = z.string().startsWith(prefix)

export const InvitrationIdVo = IdFactory(prefix, size, invitationId)

export type InvitationId = InstanceType<typeof InvitrationIdVo>

export const invitationStatus = z.enum(["pending", "accepted", "rejected"])
export type IInvitationStatus = z.infer<typeof invitationStatus>

export class InvitationDo extends AggregateRoot<any> {
  public readonly id: InvitationId
  public email: string
  public role: ISpaceMemberWithoutOwner
  public status: IInvitationStatus
  public invitedAt: Date
  public spaceId: ISpaceId
  public inviterId: string

  constructor(props: InviteDTO) {
    super()
    this.id = InvitrationIdVo.create()
    this.email = props.email
    this.role = props.role ?? "viewer"
    this.status = "pending"
    this.invitedAt = new Date()
    this.inviterId = props.inviterId
    this.spaceId = props.spaceId
  }

  public toJSON(): InvitationDTO {
    return {
      status: this.status,
      email: this.email,
      spaceId: this.spaceId,
      invitedAt: this.invitedAt,
      role: this.role,
      id: this.id.value,
      inviterId: this.inviterId,
    }
  }
}
