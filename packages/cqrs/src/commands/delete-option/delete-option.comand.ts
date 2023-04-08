import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteOptionInput } from './delete-option.command.input.js'

export class DeleteOptionCommand extends Command implements IDeleteOptionInput {
  readonly id: string
  readonly fieldId: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteOptionInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.id = props.id
  }
}
