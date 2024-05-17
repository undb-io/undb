import { BaseEvent } from "@undb/domain"
import { z } from "zod"
import { tableRLS } from "../modules"
import { tableId } from "../table-id.vo"

const EVT_SET_TABLE_RLS = "table.rls.set" as const

export const setTableRLSEventPayload = z.object({
  tableId: tableId,
  previous: tableRLS.nullable(),
  rls: tableRLS.nullable(),
})

export type ISetTableRLSEventPayload = z.infer<typeof setTableRLSEventPayload>

export class SetTableRLSEvent extends BaseEvent<ISetTableRLSEventPayload, typeof EVT_SET_TABLE_RLS> {
  name = EVT_SET_TABLE_RLS

  constructor(public readonly payload: ISetTableRLSEventPayload) {
    super(payload, undefined)
  }
}
