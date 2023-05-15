import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteWidgeCommandInput } from './delete-widge.command.interface.js'

export class DeleteWidgeCommand extends Command implements IDeleteWidgeCommandInput {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widgeId: string

  constructor(props: CommandProps<IDeleteWidgeCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widgeId = props.widgeId
  }
}
