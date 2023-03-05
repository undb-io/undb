import { IUpdateViewNameSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IUpdateViewNameCommandInput } from './udpate-view-name.command.interface.js'

export class UpdateViewNameCommand extends Command implements IUpdateViewNameCommandInput {
  public readonly tableId: string
  public readonly view: IUpdateViewNameSchema

  constructor(props: CommandProps<IUpdateViewNameCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.view = props.view
  }
}
