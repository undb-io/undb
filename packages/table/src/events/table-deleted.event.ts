import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableDTO } from "../dto"

const EVT_TABLE_DELETED = "table.deleted" as const

export const tableDeletedEventPayload = z.object({
  table: tableDTO,
})

export type ITableDeletedEventPayload = z.infer<typeof tableDeletedEventPayload>

export class TableDeletedEvent extends BaseEvent<ITableDeletedEventPayload, typeof EVT_TABLE_DELETED> {
  name = EVT_TABLE_DELETED

  constructor(
    public readonly payload: ITableDeletedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
