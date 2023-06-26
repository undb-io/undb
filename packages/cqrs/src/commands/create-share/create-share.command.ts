import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateShareCommandInput } from './create-share.command.interface.js'

export class CreateShareCommand extends Command implements ICreateShareCommandInput {
  public readonly tableId: string
  public readonly targetType: string
  public readonly targetId: string

  constructor(props: CommandProps<ICreateShareCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.targetType = props.targetId
    this.targetId = props.targetId
  }
}
