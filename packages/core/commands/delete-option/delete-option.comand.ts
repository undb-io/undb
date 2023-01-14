import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IDeleteOptionInput } from './delete-option.command.input'

export class DeleteOptionCommand extends Command implements IDeleteOptionInput {
  readonly id: string
  readonly fieldKey: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteOptionInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldKey = props.fieldKey
    this.id = props.id
  }
}
