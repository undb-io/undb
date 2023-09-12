import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateApiTokenCommandInput } from './create-api-token.command.interface.js'

export class CreateApiTokenCommand extends Command {
  constructor(props: CommandProps<ICreateApiTokenCommandInput>) {
    super(props)
  }
}
