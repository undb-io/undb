import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetFieldVisibilityCommandInput } from './set-field-visibility.command.interface'

export class SetFieldVisibilityCommand extends Command implements ISetFieldVisibilityCommandInput {
  public readonly tableId: string
  public readonly viewName?: string
  public readonly fieldName: string
  public readonly hidden: boolean

  constructor(props: CommandProps<ISetFieldVisibilityCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewName = props.viewName
    this.fieldName = props.fieldName
    this.hidden = props.hidden
  }
}
