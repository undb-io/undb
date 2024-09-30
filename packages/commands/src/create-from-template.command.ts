import { baseIdSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { createFromTemplateDTO } from "@undb/template"
import { z } from "@undb/zod"

export const createFromTemplateCommand = createFromTemplateDTO

export type ICreateFromTemplateCommand = z.infer<typeof createFromTemplateCommand>

export const createFromTemplateCommandOutput = z.object({
  baseIds: z.array(baseIdSchema),
})

export type ICreateFromTemplateCommandOutput = z.infer<typeof createFromTemplateCommandOutput>

export class CreateFromTemplateCommand extends Command implements ICreateFromTemplateCommand {
  public readonly id: string
  public readonly includeData?: boolean
  public readonly spaceId?: string

  constructor(props: CommandProps<ICreateFromTemplateCommand>) {
    super(props)
    this.id = props.id
    this.includeData = props.includeData
    this.spaceId = props.spaceId
  }
}
