import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IFilter } from '../../filter'
import type { ISetFilterCommandInput } from './set-filters.command.interface'

export class SetFitlersCommand extends Command implements ISetFilterCommandInput {
  readonly tableId: string
  readonly viewName?: string
  readonly filters: IFilter

  constructor(props: CommandProps<ISetFilterCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewName = props.viewName
    this.filters = props.filters
  }
}
