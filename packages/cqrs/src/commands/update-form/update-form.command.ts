import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateFormCommandInput } from './update-form.command.interface.js'

export class UpdateFormCommand extends Command implements IUpdateFormCommandInput {
  public readonly tableId: string
  public readonly formId: string
  public readonly name?: string

  constructor(props: CommandProps<IUpdateFormCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
    this.name = props.name
  }
}
