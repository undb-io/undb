import { IFilterOrGroupList } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetFilterCommandInput } from './set-filters.command.interface.js'

export class SetFitlersCommand extends Command implements ISetFilterCommandInput {
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
