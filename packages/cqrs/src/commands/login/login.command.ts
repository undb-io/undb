import type { IQueryUser } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ILoginCommandInput } from './login.command.interface.js'

export class LoginCommand extends Command implements ILoginCommandInput {
  readonly user: IQueryUser

  constructor(props: CommandProps<ILoginCommandInput>) {
    super(props)
    this.user = props.user
  }
}
