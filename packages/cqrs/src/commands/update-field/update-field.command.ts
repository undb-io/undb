import { IUpdateFieldSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IUpdateFieldCommandInput } from './update-field.command.interface.js'

export class UpdateFieldCommand extends Command implements IUpdateFieldCommandInput {
  public readonly tableId: string
  public readonly fieldId: string
  public readonly field: IUpdateFieldSchema

  constructor(props: CommandProps<IUpdateFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.field = props.field
  }
}
