import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFieldDisplayCommandInput } from './set-field-display.command.interface.js'

export class SetFieldDisplayCommand extends Command implements ISetFieldDisplayCommandInput {
  readonly tableId: string
  readonly fieldId: string
  readonly display: boolean

  constructor(props: CommandProps<ISetFieldDisplayCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.display = props.display
  }
}
