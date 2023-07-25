import type { IUpdateTableSchemaSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateTableCommandInput } from './update-table.command.interface.js'

export class UpdateTableCommand extends Command implements IUpdateTableCommandInput {
  public readonly id: string
  public readonly name?: string
  public readonly emoji?: string | null
  public readonly schema?: IUpdateTableSchemaSchema

  constructor(props: CommandProps<IUpdateTableCommandInput>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.emoji = props.emoji
    this.schema = props.schema
  }
}
