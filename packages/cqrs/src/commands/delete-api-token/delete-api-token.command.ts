import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteApiTokenCommandInput } from './delete-api-token.command.interface.js'

export class DeleteApiTokenCommand extends Command implements IDeleteApiTokenCommandInput {
  public readonly apiTokenId: string

  constructor(props: CommandProps<IDeleteApiTokenCommandInput>) {
    super(props)
    this.apiTokenId = props.apiTokenId
  }
}
