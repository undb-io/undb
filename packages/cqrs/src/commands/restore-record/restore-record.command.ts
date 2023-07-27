import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IRestoreRecordInput } from './restore-record.command.input.js'

export class RestoreRecordCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IRestoreRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
