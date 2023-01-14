import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IUpdateOptionSchema } from '../../option'
import type { IUpdateOptionCommandInput } from './update-option.command.interface'

export class UpdateOptionCommand extends Command implements IUpdateOptionCommandInput {
  readonly tableId: string
  readonly fieldKey: string
  readonly id: string
  readonly option: IUpdateOptionSchema

  constructor(props: CommandProps<IUpdateOptionCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldKey = props.fieldKey
    this.id = props.id
    this.option = props.option
  }
}
