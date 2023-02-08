import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IBulkDeleteRecordsInput } from './bulk-delete-records.command.input'

export class BulkDeleteRecordsCommand extends Command {
  readonly ids: string[]
  readonly tableId: string

  constructor(props: CommandProps<IBulkDeleteRecordsInput>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
