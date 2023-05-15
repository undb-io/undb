import { IRelayoutWidgeSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IRelayoutWidgesCommandInput } from './relayout-widges.command.interface.js'

export class RelayoutWidgesCommand extends Command implements IRelayoutWidgesCommandInput {
  readonly tableId: string
  readonly viewId: string
  readonly widges: IRelayoutWidgeSchema[]

  constructor(props: CommandProps<IRelayoutWidgesCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widges = props.widges
  }
}
