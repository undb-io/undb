import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateProfileCommandInput } from './update-profile.command.interface.js'

export class UpdateProfileCommand extends Command implements IUpdateProfileCommandInput {
  readonly userId: string
  readonly username?: string
  readonly avatar?: string | null

  constructor(props: CommandProps<IUpdateProfileCommandInput>) {
    super(props)
    this.userId = props.userId
    this.username = props.username
    this.avatar = props.avatar
  }
}
