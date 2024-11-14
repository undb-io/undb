import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const updateaccountCommand = z.object({
  userId: z.string(),
  username: z.string().min(1),
})
export type IUpdateAccountCommand = z.infer<typeof updateaccountCommand>

export class UpdateAccountCommand extends Command implements IUpdateAccountCommand {
  public readonly userId: string
  public readonly username: string

  constructor(props: CommandProps<IUpdateAccountCommand>) {
    super(props)
    this.userId = props.userId
    this.username = props.username
  }
}
