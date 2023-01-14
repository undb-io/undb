import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IReorderOptionsCommandInput } from './reorder-options.command.interface'

export class ReorderOptionsCommand extends Command implements IReorderOptionsCommandInput {
  public readonly tableId: string
  public readonly fieldKey: string
  public readonly from: string
  public readonly to: string

  constructor(props: CommandProps<IReorderOptionsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldKey = props.fieldKey
    this.from = props.from
    this.to = props.to
  }
}
