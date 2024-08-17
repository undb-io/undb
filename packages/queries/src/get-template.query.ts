import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const getTemplateQuery = z.object({
  spaceId: spaceIdSchema,
  baseId: baseIdSchema,
})

export type IGetTemplateQuery = z.infer<typeof getTemplateQuery>

export const getTemplateOutput = z.object({
  baseId: baseIdSchema,
  spaceId: spaceIdSchema,
  name: z.string(),
})

export type IGetTemplateOutput = z.infer<typeof getTemplateOutput>

export class GetTemplateQuery extends Query implements IGetTemplateQuery {
  public readonly spaceId: string
  public readonly baseId: string

  constructor(props: QueryProps<IGetTemplateQuery>) {
    super()
    this.spaceId = props.spaceId
    this.baseId = props.baseId
  }
}
