import { IQueryUser } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ILoginCommandInput } from './login.command.interface.js'

export class LoginCommand extends Command implements ILoginCommandInput {
  readonly user: IQueryUser

  constructor(props: CommandProps<ILoginCommandInput>) {
    super(props)
    this.user = props.user
  }
}
