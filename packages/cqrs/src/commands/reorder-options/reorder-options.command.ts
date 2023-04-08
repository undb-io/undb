import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IReorderOptionsCommandInput } from './reorder-options.command.interface.js'

export class ReorderOptionsCommand extends Command implements IReorderOptionsCommandInput {
  public readonly tableId: string
  public readonly fieldId: string
  public readonly from: string
  public readonly to: string

  constructor(props: CommandProps<IReorderOptionsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.from = props.from
    this.to = props.to
  }
}
