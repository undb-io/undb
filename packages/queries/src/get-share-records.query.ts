import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { recordsDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getShareRecordsQuery = z.object({
  shareId: shareIdSchema,
})

export type IGetShareRecordsQuery = z.infer<typeof getShareRecordsQuery>

export const getShareRecordsOutput = z.object({
  total: z.number(),
  records: recordsDTO,
})

export type IGetShareRecordsOutput = z.infer<typeof getShareRecordsOutput>

export class GetShareRecordsQuery extends Query implements IGetShareRecordsQuery {
  public readonly shareId: string

  constructor(props: QueryProps<IGetShareRecordsQuery>) {
    super()
    this.shareId = props.shareId
  }
}
