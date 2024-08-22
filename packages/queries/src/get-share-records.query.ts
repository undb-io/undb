import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { recordsDTO, tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const getShareRecordsQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId.optional(),
  viewId: viewId.optional(),
  q: z.string().optional().nullable(),
})

export type IGetShareRecordsQuery = z.infer<typeof getShareRecordsQuery>

export const getShareRecordsOutput = z.object({
  total: z.number(),
  records: recordsDTO,
})

export type IGetShareRecordsOutput = z.infer<typeof getShareRecordsOutput>

export class GetShareRecordsQuery extends Query implements IGetShareRecordsQuery {
  public readonly shareId: string
  public readonly tableId: string | undefined
  public readonly viewId: string | undefined
  public readonly q: string | undefined

  constructor(props: QueryProps<IGetShareRecordsQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.q = props.q
  }
}
