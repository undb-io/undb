import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IBulkDuplicateRecordsInput } from './bulk-duplicate-records.command.input.js'

export class BulkDuplicateRecordsCommand extends Command {
  readonly ids: string[]
  readonly tableId: string

  constructor(props: CommandProps<IBulkDuplicateRecordsInput>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
