import { baseIdSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { templateId } from "@undb/template/src/template/value-objects/template-id.vo"
import { z } from "@undb/zod"

export const createFromTemplateCommand = z.object({
  id: templateId,
})

export type ICreateFromTemplateCommand = z.infer<typeof createFromTemplateCommand>

export const createFromTemplateCommandOutput = z.object({
  baseIds: z.array(baseIdSchema),
})

export type ICreateFromTemplateCommandOutput = z.infer<typeof createFromTemplateCommandOutput>

export class CreateFromTemplateCommand extends Command implements ICreateFromTemplateCommand {
  public readonly id: string

  constructor(props: CommandProps<ICreateFromTemplateCommand>) {
    super(props)
    this.id = props.id
  }
}
