import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFieldWidthCommandInput } from './set-field-width.command.interface.js'

export class SetFieldWidthCommand extends Command implements ISetFieldWidthCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly fieldId: string
  public readonly width: number

  constructor(props: CommandProps<ISetFieldWidthCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.fieldId = props.fieldId
    this.width = props.width
  }
}
