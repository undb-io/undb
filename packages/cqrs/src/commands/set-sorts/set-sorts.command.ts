import { ISorts } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetSortsCommandInput } from './set-sorts.command.interface.js'

export class SetSortsCommand extends Command implements ISetSortsCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly sorts: ISorts

  constructor(props: CommandProps<ISetSortsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.sorts = props.sorts
  }
}
