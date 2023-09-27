import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IMoveToBaseCommandInput } from './move-to-base.command.interface.js'

export class MoveToBaseCommand extends Command implements IMoveToBaseCommandInput {
  public readonly tableId: string
  public readonly baseId: string

  constructor(props: CommandProps<IMoveToBaseCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.baseId = props.baseId
  }
}
