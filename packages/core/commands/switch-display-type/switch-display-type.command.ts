import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IViewDisplayType } from '../../view/index.js'
import type { ISwitchDisplayTypeCommandInput } from './switch-display-type.command.interface.js'

export class SwitchDisplayTypeCommand extends Command implements ISwitchDisplayTypeCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly displayType: IViewDisplayType

  constructor(props: CommandProps<ISwitchDisplayTypeCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.displayType = props.displayType
  }
}
