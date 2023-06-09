import type { IMutateRecordValueSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateRecordsInput } from './create-records.command.input.js'

export class CreateRecordsCommand extends Command {
  readonly tableId: string
  readonly records: { id?: string; values: IMutateRecordValueSchema }[]

  constructor(props: CommandProps<ICreateRecordsInput>) {
    super(props)
    this.tableId = props.tableId
    this.records = props.records
  }
}
