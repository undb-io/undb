import { ICreateFieldSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateFieldCommandInput } from './create-field.command.interface.js'

export class CreateFieldCommand extends Command implements ICreateFieldCommandInput {
  public readonly tableId: string
  public readonly field: ICreateFieldSchema

  constructor(props: CommandProps<ICreateFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.field = props.field
  }
}
