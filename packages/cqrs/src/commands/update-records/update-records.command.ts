import type { IMutateRecordValueSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateRecordsInput } from './update-records.command.input.js'

export class UpdateRecordsCommand extends Command {
  readonly tableId: string
  readonly records: { id: string; values: IMutateRecordValueSchema }[]

  constructor(props: CommandProps<IUpdateRecordsInput>) {
    super(props)
    this.tableId = props.tableId
    this.records = props.records
  }
}
