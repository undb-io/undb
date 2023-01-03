import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IMutateRecordValueSchema } from '../../record/record.schema'
import type { IUpdateRecordCommandInput } from './update-record.command.input'

export class UpdateRecordCommand extends Command implements IUpdateRecordCommandInput {
  readonly id?: string
  readonly tableId: string
  readonly value: IMutateRecordValueSchema

  constructor(props: CommandProps<IUpdateRecordCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.value = props.value
  }
}
