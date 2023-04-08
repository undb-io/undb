import { ICreateOptionSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateOptionCommandInput } from './create-option.command.interface.js'

export class CreateOptionCommand extends Command implements ICreateOptionCommandInput {
  readonly tableId: string
  readonly fieldId: string
  readonly option: ICreateOptionSchema

  constructor(props: CommandProps<ICreateOptionCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.option = props.option
  }
}
