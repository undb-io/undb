import { deleteInvitationDTO } from "@undb/authz"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const deleteInvitationCommand = deleteInvitationDTO

export type IDeleteInvitationCommand = z.infer<typeof deleteInvitationCommand>

export class DeleteInvitationCommand extends Command implements IDeleteInvitationCommand {
  public readonly id: string

  constructor(props: CommandProps<IDeleteInvitationCommand>) {
    super(props)
    this.id = props.id
  }
}
