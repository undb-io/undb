import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteFormCommandInput } from './delete-form.command.interface.js'

export class DeleteFormCommand extends Command implements IDeleteFormCommandInput {
  public readonly tableId: string
  public readonly formId: string

  constructor(props: CommandProps<IDeleteFormCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
  }
}
