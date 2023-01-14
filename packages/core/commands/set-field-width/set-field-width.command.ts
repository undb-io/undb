import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetFieldWidthCommandInput } from './set-field-width.command.interface'

export class SetFieldWidthCommand extends Command implements ISetFieldWidthCommandInput {
  public readonly tableId: string
  public readonly viewKey?: string
  public readonly fieldKey: string
  public readonly width: number

  constructor(props: CommandProps<ISetFieldWidthCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewKey = props.viewKey
    this.fieldKey = props.fieldKey
    this.width = props.width
  }
}
