import type { ICreateTableSchemaInput, IMutateRecordValueSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateTableInput } from './create-table.command.interface.js'

export class CreateTableCommand extends Command implements ICreateTableInput {
  readonly name: string
  readonly baseId?: string
  readonly emoji?: string | null
  readonly schema: ICreateTableSchemaInput
  readonly records?: IMutateRecordValueSchema[]

  constructor(props: CommandProps<ICreateTableInput>) {
    super(props)
    this.name = props.name
    this.baseId = props.baseId
    this.emoji = props.emoji
    this.schema = props.schema
    this.records = props.records
  }
}
