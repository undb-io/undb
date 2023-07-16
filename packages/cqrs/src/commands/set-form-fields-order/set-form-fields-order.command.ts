import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFormFieldsOrderCommandInput } from './set-form-fields-order.command.interface.js'

export class SetFormFieldsOrderCommand extends Command implements ISetFormFieldsOrderCommandInput {
  readonly tableId: string
  readonly formId: string
  readonly fieldsOrder: string[]

  constructor(props: CommandProps<ISetFormFieldsOrderCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.formId = props.formId
    this.fieldsOrder = props.fieldsOrder
  }
}
