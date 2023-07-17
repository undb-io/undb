import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFormFieldVisibilityCommandInput } from './set-form-field-visibility.command.interface.js'

export class SetFormFieldVisibilityCommand extends Command implements ISetFormFieldVisibilityCommandInput {
  public readonly tableId: string
  public readonly formId: string
  public readonly visibility: Record<string, boolean>

  constructor(props: CommandProps<ISetFormFieldVisibilityCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
    this.visibility = props.visibility
  }
}
