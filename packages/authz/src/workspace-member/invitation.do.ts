import { AggregateRoot, IdFactory } from "@undb/domain"
import { z } from "@undb/zod"
import type { InvitationDTO, InviteDTO } from "./dto"
import type { IWorkspaceMemberWithoutOwner } from "./workspace-member"

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
  public role: IWorkspaceMemberWithoutOwner
  public status: IInvitationStatus
  public invitedAt: Date
  public inviterId: string

  constructor(props: InviteDTO) {
    super()
    this.id = InvitrationIdVo.create()
    this.email = props.email
    this.role = props.role ?? "viewer"
    this.status = "pending"
    this.invitedAt = new Date()
    this.inviterId = props.inviterId
  }

  public toJSON(): InvitationDTO {
    return {
      status: this.status,
      email: this.email,
      role: this.role,
      id: this.id.value,
      inviterId: this.inviterId,
    }
  }
}
