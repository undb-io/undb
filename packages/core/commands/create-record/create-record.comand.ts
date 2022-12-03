import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateFieldValue } from '../../field'
import type { ICreateRecordInput } from './create-record.command.input'

export class CreateRecordCommand extends Command {
  readonly id?: string
  readonly tableId: string
  readonly value: Record<string, ICreateFieldValue>

  constructor(props: CommandProps<ICreateRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.value = props.value
  }
}
