import { baseIdSchema,createBaseDTO } from "@undb/base"
import { Command,type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"
import { createTableCommand } from "./create-table.command"

export const createBaseCommand = createBaseDTO
  .omit({
    id: true,
  })
  .merge(
    z.object({
      tables: createTableCommand.array().optional(),
    }),
  )

export type ICreateBaseCommand = z.infer<typeof createBaseCommand>

export const createBaseCommandOutput = baseIdSchema
export type ICreateBaseCommandOutput = z.infer<typeof createBaseCommandOutput>

export class CreateBaseCommand extends Command implements ICreateBaseCommand {
  public readonly name: string
  public spaceId: string

  constructor(props: CommandProps<ICreateBaseCommand>) {
    super(props)
    this.name = props.name
    this.spaceId = props.spaceId
  }
}
