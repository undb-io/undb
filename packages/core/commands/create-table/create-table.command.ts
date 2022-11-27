import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateTableSchemaInput } from '../../value-objects'
import type { ICreateTableInput } from './create-table.command.interface'

export class CreateTableCommand extends Command implements ICreateTableInput {
  readonly name: string
  readonly schema: ICreateTableSchemaInput

  constructor(props: CommandProps<ICreateTableInput>) {
    super(props)
    this.name = props.name
    this.schema = props.schema
  }
}
