import { Command, type CommandProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const createFromTemplateCommand = z.object({
  shareId: shareIdSchema,
  targetSpaceId: spaceIdSchema.optional(),
  name: z.string().optional(),
  includeData: z.boolean().optional(),
})

export type ICreateFromTemplateCommand = z.infer<typeof createFromTemplateCommand>

export class CreateFromTemplateCommand extends Command implements ICreateFromTemplateCommand {
  public readonly shareId: string
  public readonly targetSpaceId?: string
  public readonly name?: string
  public readonly includeData?: boolean

  constructor(props: CommandProps<ICreateFromTemplateCommand>) {
    super(props)
    this.shareId = props.shareId
    this.targetSpaceId = props.targetSpaceId
    this.name = props.name
    this.includeData = props.includeData
  }
}
