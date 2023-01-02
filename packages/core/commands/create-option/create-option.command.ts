import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateOptionSchema } from '../../option'
import type { ICreateOptionCommandInput } from './create-table.command.interface'

export class CreateOptionCommand extends Command implements ICreateOptionCommandInput {
  readonly tableId: string
  readonly option: ICreateOptionSchema

  constructor(props: CommandProps<ICreateOptionCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.option = props.option
  }
}
