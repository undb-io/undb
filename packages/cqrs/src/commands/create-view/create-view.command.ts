import type { ICreateViewSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateViewCommandInput } from './create-view.command.interface.js'

export class CreateViewCommand extends Command implements ICreateViewCommandInput {
  public readonly tableId: string
  public readonly view: ICreateViewSchema

  constructor(props: CommandProps<ICreateViewCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.view = props.view
  }
}
