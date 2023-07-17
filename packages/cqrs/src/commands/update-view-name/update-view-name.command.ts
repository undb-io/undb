import type { IUpdateViewNameSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateViewNameCommandInput } from './update-view-name.command.interface.js'

export class UpdateViewNameCommand extends Command implements IUpdateViewNameCommandInput {
  public readonly tableId: string
  public readonly view: IUpdateViewNameSchema

  constructor(props: CommandProps<IUpdateViewNameCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.view = props.view
  }
}
