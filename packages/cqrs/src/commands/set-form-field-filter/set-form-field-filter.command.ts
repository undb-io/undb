import type { IRootFilter } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFormFieldFilterCommandInput } from './set-form-field-filter.command.interface.js'

export class SetFormFieldFilterCommand extends Command implements ISetFormFieldFilterCommandInput {
  public readonly tableId: string
  public readonly formId: string
  public readonly fieldId: string
  public readonly filter: IRootFilter

  constructor(props: CommandProps<ISetFormFieldFilterCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
    this.fieldId = props.fieldId
    this.filter = props.filter
  }
}
