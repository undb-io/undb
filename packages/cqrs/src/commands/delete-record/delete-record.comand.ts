import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteRecordInput } from './delete-record.command.input.js'

export class DeleteRecordCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
