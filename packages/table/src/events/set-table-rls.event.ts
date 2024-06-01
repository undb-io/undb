import { BaseEvent } from "@undb/domain"
import { z } from "@undb/zod"
import { rlsDTO } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_TABLE_RLS = "table.rls.set" as const

export const setTableRLSEventPayload = z.object({
  tableId: tableId,
  previous: rlsDTO.nullable(),
  rls: rlsDTO.nullable(),
})

export type ISetTableRLSEventPayload = z.infer<typeof setTableRLSEventPayload>

export class SetTableRLSEvent extends BaseEvent<ISetTableRLSEventPayload, typeof EVT_SET_TABLE_RLS> {
  name = EVT_SET_TABLE_RLS

  constructor(public readonly payload: ISetTableRLSEventPayload) {
    super(payload, undefined)
  }
}
