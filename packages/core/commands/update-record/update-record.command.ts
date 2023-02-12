import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IMutateRecordValueSchema } from '../../record/record.schema.js'
import type { IUpdateRecordCommandInput } from './update-record.command.input.js'

export class UpdateRecordCommand extends Command implements IUpdateRecordCommandInput {
  readonly id: string
  readonly tableId: string
  readonly value: IMutateRecordValueSchema

  constructor(props: CommandProps<IUpdateRecordCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.value = props.value
  }
}
