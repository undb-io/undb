import { IFilterOrGroupList } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFilterCommandInput } from './set-filters.command.interface.js'

export class SetFiltersCommand extends Command implements ISetFilterCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly filter: IFilterOrGroupList | null

  constructor(props: CommandProps<ISetFilterCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.filter = props.filter
  }
}
