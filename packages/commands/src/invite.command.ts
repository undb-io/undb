import { inviteDTO, type IWorkspaceMemberRole } from "@undb/authz"
import { Command, type CommandProps } from "@undb/domain"
import type { z } from "@undb/zod"

export const inviteCommand = inviteDTO
export type IInviteCommand = z.infer<typeof inviteCommand>

export class InviteCommand extends Command implements IInviteCommand {
  public readonly email: string
  public readonly role?: IWorkspaceMemberRole

  constructor(props: CommandProps<IInviteCommand>) {
    super(props)
    this.email = props.email
    this.role = props.role
  }
}
