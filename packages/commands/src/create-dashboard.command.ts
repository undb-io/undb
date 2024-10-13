import { baseIdSchema, baseNameSchema } from "@undb/base"
import { createDashboardDTO } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const createDashboardCommand = createDashboardDTO
  .omit({
    spaceId: true,
  })
  .extend({
    baseId: baseIdSchema.optional(),
    baseName: baseNameSchema.optional(),
  })

export type ICreateDashboardCommand = z.infer<typeof createDashboardCommand>

export class CreateDashboardCommand extends Command implements ICreateDashboardCommand {
  public readonly id: string | undefined
  public readonly name: string
  public readonly baseName: string | undefined
  public readonly baseId: string | undefined

  constructor(props: CommandProps<ICreateDashboardCommand>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.baseName = props.baseName
    this.baseId = props.baseId
  }
}
