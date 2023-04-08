import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetFieldVisibilityCommandInput } from './set-field-visibility.command.interface.js'

export class SetFieldVisibilityCommand extends Command implements ISetFieldVisibilityCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly fieldId: string
  public readonly hidden: boolean

  constructor(props: CommandProps<ISetFieldVisibilityCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.fieldId = props.fieldId
    this.hidden = props.hidden
  }
}
