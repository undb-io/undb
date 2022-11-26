import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateTableSchemaSchema } from '../../value-objects'
import type { ICreateTableInput } from './create-table.command.interface'

export class CreateTableCommand extends Command implements ICreateTableInput {
  readonly name: string
  readonly schema: ICreateTableSchemaSchema

  constructor(props: CommandProps<ICreateTableInput>) {
    super(props)
    this.name = props.name
    this.schema = props.schema
  }
}
