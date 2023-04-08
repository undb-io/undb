import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IRegisterCommandInput } from './register.command.interface.js'

export class RegisterCommand extends Command implements IRegisterCommandInput {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<IRegisterCommandInput>) {
    super(props)
    this.email = props.email
    this.password = props.password
  }
}
