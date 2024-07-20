import { AggregateRoot, IdFactory } from "@undb/domain"
import { z } from "@undb/zod"
import type { InviteDTO } from "./dto"
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
  public readonly email: string
  public readonly role: IWorkspaceMemberWithoutOwner
  public readonly status: IInvitationStatus

  constructor(props: InviteDTO) {
    super()
    this.id = InvitrationIdVo.create()
    this.email = props.email
    this.role = props.role ?? "viewer"
    this.status = "pending"
  }
}
