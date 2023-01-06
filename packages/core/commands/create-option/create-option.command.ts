import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateOptionSchema } from '../../option'
import type { ICreateOptionCommandInput } from './create-option.command.interface'

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
