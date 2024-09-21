import { baseIdSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const createFromTemplateCommand = z.object({
  templateName: z.string(),
})

export type ICreateFromTemplateCommand = z.infer<typeof createFromTemplateCommand>

export const createFromTemplateCommandOutput = z.object({
  baseIds: z.array(baseIdSchema),
})

export type ICreateFromTemplateCommandOutput = z.infer<typeof createFromTemplateCommandOutput>

export class CreateFromTemplateCommand extends Command implements ICreateFromTemplateCommand {
  public readonly templateName: string

  constructor(props: CommandProps<ICreateFromTemplateCommand>) {
    super(props)
    this.templateName = props.templateName
  }
}
