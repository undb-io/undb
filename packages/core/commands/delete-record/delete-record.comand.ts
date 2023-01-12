import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IDeleteRecordInput } from './delete-record.command.input'

export class DeleteRecordCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
