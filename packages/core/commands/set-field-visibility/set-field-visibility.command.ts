import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetFieldVisibilityCommandInput } from './set-field-visibility.command.interface'

export class SetFieldVisibilityCommand extends Command implements ISetFieldVisibilityCommandInput {
  public readonly tableId: string
  public readonly viewKey?: string
  public readonly fieldId: string
  public readonly hidden: boolean

  constructor(props: CommandProps<ISetFieldVisibilityCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewKey = props.viewKey
    this.fieldId = props.fieldId
    this.hidden = props.hidden
  }
}
