import type { ICreateFormSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateFormCommandInput } from './create-form.command.interface.js'

export class CreateFormCommand extends Command implements ICreateFormCommandInput {
  public readonly tableId: string
  public readonly form: ICreateFormSchema

  constructor(props: CommandProps<ICreateFormCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.form = props.form
  }
}
