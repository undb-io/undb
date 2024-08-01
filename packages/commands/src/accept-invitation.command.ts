import { acceptinvitationDTO } from "@undb/authz"
import { Command, type CommandProps } from "@undb/domain"
import type { z } from "@undb/zod"

export const acceptinvitationCommand = acceptinvitationDTO
export type IAcceptInvitationCommand = z.infer<typeof acceptinvitationCommand>

export class AcceptInvitationCommand extends Command implements IAcceptInvitationCommand {
  public readonly id: string

  constructor(props: CommandProps<IAcceptInvitationCommand>) {
    super(props)
    this.id = props.id
  }
}
