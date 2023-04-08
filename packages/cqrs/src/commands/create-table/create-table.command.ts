import { ICreateTableSchemaInput } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateTableInput } from './create-table.command.interface.js'

export class CreateTableCommand extends Command implements ICreateTableInput {
  readonly name: string
  readonly schema: ICreateTableSchemaInput

  constructor(props: CommandProps<ICreateTableInput>) {
    super(props)
    this.name = props.name
    this.schema = props.schema
  }
}
