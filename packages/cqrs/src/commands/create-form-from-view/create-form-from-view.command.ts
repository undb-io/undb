import type { ICreateFormBaseSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateFormFromViewCommandInput } from './create-form-from-view.command.interface.js'

export class CreateFormFromViewCommand extends Command implements ICreateFormFromViewCommandInput {
  public readonly tableId: string
  public readonly viewId: string
  public readonly form: Partial<ICreateFormBaseSchema>

  constructor(props: CommandProps<ICreateFormFromViewCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.form = props.form
  }
}
