import { inviteDTO, type IWorkspaceMemberWithoutOwner } from "@undb/authz"
import { Command, type CommandProps } from "@undb/domain"
import type { z } from "@undb/zod"

export const inviteCommand = inviteDTO.omit({ inviterId: true })
export type IInviteCommand = z.infer<typeof inviteCommand>

export class InviteCommand extends Command implements IInviteCommand {
  public readonly email: string
  public readonly role?: IWorkspaceMemberWithoutOwner

  constructor(props: CommandProps<IInviteCommand>) {
    super(props)
    this.email = props.email
    this.role = props.role
  }
}
