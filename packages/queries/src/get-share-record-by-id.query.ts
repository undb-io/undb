import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { recordDTO, recordId } from "@undb/table"
import { z } from "@undb/zod"

export const getShareRecordByIdQuery = z.object({
  shareId: shareIdSchema,
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

  constructor(props: QueryProps<IGetShareRecordByIdQuery>) {
    super()
    this.shareId = props.shareId
    this.recordId = props.recordId
  }
}
