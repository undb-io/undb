import { IMutateRecordValueSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateRecordInput } from './create-record.command.input.js'

export class CreateRecordCommand extends Command {
  readonly id?: string
  readonly tableId: string
  readonly values: IMutateRecordValueSchema

  constructor(props: CommandProps<ICreateRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.values = props.values
  }
}
