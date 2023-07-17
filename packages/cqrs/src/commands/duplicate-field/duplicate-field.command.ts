import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDuplicateFieldInput } from './duplicate-field.command.input.js'

export class DuplicateFieldCommand extends Command {
  readonly id: string
  readonly tableId: string
  readonly includesValues?: boolean

  constructor(props: CommandProps<IDuplicateFieldInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.includesValues = props.includesValues
  }
}
