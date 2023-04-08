import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IBulkDeleteRecordsInput } from './bulk-delete-records.command.input.js'

export class BulkDeleteRecordsCommand extends Command {
  readonly ids: string[]
  readonly tableId: string

  constructor(props: CommandProps<IBulkDeleteRecordsInput>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
