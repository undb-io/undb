import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFormFieldRequirementsCommandInput } from './set-form-field-requirements.command.interface.js'

export class SetFormFieldRequirementsCommand extends Command implements ISetFormFieldRequirementsCommandInput {
  public readonly tableId: string
  public readonly formId: string
  public readonly requirements: Record<string, boolean>

  constructor(props: CommandProps<ISetFormFieldRequirementsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
    this.requirements = props.requirements
  }
}
