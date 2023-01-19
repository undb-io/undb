import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IDuplicateRecordInput } from './duplicate-record.command.input'

export class DuplicateRecordCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDuplicateRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
