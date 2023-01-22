import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISorts } from '../../view'
import type { ISetSortsCommandInput } from './set-sorts.command.interface'

export class SetSortsCommand extends Command implements ISetSortsCommandInput {
  readonly tableId: string
  readonly viewKey?: string
  readonly sorts: ISorts

  constructor(props: CommandProps<ISetSortsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewKey = props.viewKey
    this.sorts = props.sorts
  }
}
