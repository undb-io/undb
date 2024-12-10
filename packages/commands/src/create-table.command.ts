import { baseIdSchema, baseNameSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import type { ICreateSchemaDTO } from "@undb/table"
import { createTableDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const createTableCommand = createTableDTO
  .omit({ spaceId: true })
  .merge(z.object({ baseId: baseIdSchema.optional(), baseName: baseNameSchema.optional() }))

export type ICreateTableCommand = z.infer<typeof createTableCommand>

export const createTableCommandOutput = tableId

export type ICreateTableCommandOutput = z.infer<typeof createTableCommandOutput>

export class CreateTableCommand extends Command implements ICreateTableCommand {
  public readonly id?: string
  public readonly name: string
  public readonly baseId?: string
  public readonly baseName?: string
  public readonly schema: ICreateSchemaDTO

  constructor(props: CommandProps<ICreateTableCommand>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.baseId = props.baseId
    this.baseName = props.baseName
    this.schema = props.schema
  }
}
