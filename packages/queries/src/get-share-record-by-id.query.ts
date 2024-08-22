import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { recordDTO, recordId, tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const getShareRecordByIdQuery = z.object({
  shareId: shareIdSchema,
  tableId: tableId.optional(),
  viewId: viewId.optional(),
  recordId: recordId,
})

export type IGetShareRecordByIdQuery = z.infer<typeof getShareRecordByIdQuery>

export const getShareRecordByIdOutput = z.object({
  record: recordDTO.nullable(),
})

export type IGetShareRecordByIdOutput = z.infer<typeof getShareRecordByIdOutput>

export class GetShareRecordByIdQuery extends Query implements IGetShareRecordByIdQuery {
  public readonly shareId: string
  public readonly recordId: string
  public readonly tableId: string | undefined
  public readonly viewId: string | undefined

  constructor(props: QueryProps<IGetShareRecordByIdQuery>) {
    super()
    this.shareId = props.shareId
    this.tableId = props.tableId
    this.recordId = props.recordId
    this.viewId = props.viewId
  }
}
