import { baseIdSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const createFromTemplateCommand = z.object({
  spaceId: spaceIdSchema,
  baseId: baseIdSchema,
  targetSpaceId: spaceIdSchema.optional(),
  name: z.string().optional(),
  includeData: z.boolean().optional(),
})

export type ICreateFromTemplateCommand = z.infer<typeof createFromTemplateCommand>

export class CreateFromTemplateCommand extends Command implements ICreateFromTemplateCommand {
  public readonly spaceId: string
  public readonly baseId: string
  public readonly targetSpaceId?: string
  public readonly name?: string
  public readonly includeData?: boolean

  constructor(props: CommandProps<ICreateFromTemplateCommand>) {
    super(props)
    this.spaceId = props.spaceId
    this.baseId = props.baseId
    this.targetSpaceId = props.targetSpaceId
    this.name = props.name
    this.includeData = props.includeData
  }
}
