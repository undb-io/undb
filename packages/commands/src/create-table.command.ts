import { Command, type CommandProps } from '@undb/domain'
import type { ICreateSchemaDTO } from '@undb/table'
import { createTableDTO } from '@undb/table'
import { z } from 'zod'

export const createTableCommand = createTableDTO.omit({ id: true })

export type ICreateTableCommand = z.infer<typeof createTableCommand>

export class CreateTableCommand extends Command implements ICreateTableCommand {
  public readonly name: string
  public readonly schema: ICreateSchemaDTO

  constructor(props: CommandProps<ICreateTableCommand>) {
    super(props)
    this.name = props.name
    this.schema = props.schema
  }
}
