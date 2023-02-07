import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IBulkDeleteRecordInput } from './bulk-delete-record.command.input'

export class BulkDeleteRecordCommand extends Command {
  readonly ids: string[]
  readonly tableId: string

  constructor(props: CommandProps<IBulkDeleteRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
