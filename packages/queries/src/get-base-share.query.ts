import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const getBaseShareQuery = z.object({
  shareId: shareIdSchema,
})

export type IGetBaseShareQuery = z.infer<typeof getBaseShareQuery>

export const getBaseShareOutput = z.object({
  baseId: baseIdSchema,
  spaceId: spaceIdSchema,
  name: z.string(),
})

export type IGetBaseShareOutput = z.infer<typeof getBaseShareOutput>

export class GetBaseShareQuery extends Query implements IGetBaseShareQuery {
  public readonly shareId: string

  constructor(props: QueryProps<IGetBaseShareQuery>) {
    super()
    this.shareId = props.shareId
  }
}
