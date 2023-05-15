import { ICreateWidgeSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateWidgeCommandInput } from './create-widge.command.interface.js'

export class CreateWidgeCommand extends Command implements ICreateWidgeCommandInput {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widge: ICreateWidgeSchema

  constructor(props: CommandProps<ICreateWidgeCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widge = props.widge
  }
}
