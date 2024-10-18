import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { tableDTO } from "../dto"

const EVT_TABLE_CREATED = "table.created" as const

export const tableCreatedEventPayload = z.object({
  table: tableDTO,
})

export type ITableCreatedEventPayload = z.infer<typeof tableCreatedEventPayload>

export class TableCreatedEvent extends BaseEvent<ITableCreatedEventPayload, typeof EVT_TABLE_CREATED> {
  name = EVT_TABLE_CREATED

  constructor(
    public readonly payload: ITableCreatedEventPayload,
    spaceId: string,
  ) {
    super(payload, undefined, spaceId)
  }
}
