import { IMutateRecordValueSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IUpdateRecordCommandInput } from './update-record.command.input.js'

export class UpdateRecordCommand extends Command implements IUpdateRecordCommandInput {
  readonly id: string
  readonly tableId: string
  readonly values: IMutateRecordValueSchema

  constructor(props: CommandProps<IUpdateRecordCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.values = props.values
  }
}
