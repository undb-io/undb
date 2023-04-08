import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IResetFieldSortCommandInput } from './reset-field-sort.command.interface.js'

export class ResetFieldSortCommand extends Command implements IResetFieldSortCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly fieldId: string

  constructor(props: CommandProps<IResetFieldSortCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.fieldId = props.fieldId
  }
}
